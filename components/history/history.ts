// Input
// - Historia rajapinta
// - Nykyinen tekstiolio
//
// Ominaisuudet
// - Vanha versio kokonaisuudessaan
// - Vain diffi
// - Historia slideri (rev_id)
// - Päivämäärän valinta
// - Kieliversion valinta
// - Tietyn kieliversion viimeisin muutos
// - Yksi draggable ikkuna joka aktivoituu ckeditoria klikatessa
// - Toggle näytä/piilota (oletuksena piilossa)
// - Sijainnin valinnainen synkkaus valitun ckeditorin viereen
// - Responsiivinen??


namespace Actions {
    export const HistoryShow = "historymodal:show";
    export const HistoryHide = "historymodal:hide";
    export const HistorySetLang = "historymodal:setLang";
    export const HistorySetObj = "historymodal:setSetObj";
    export const HistoryClearObj = "historymodal:setClearObj";
}


namespace HistoryModal {
    let i;
    export const init = ($injector) => {
        i = inject($injector, ["$rootScope"]);
    };

    export const show = () => {
        i.$rootScope.$broadcast(Actions.HistoryShow);
    };

    export const hide = () => {
        i.$rootScope.$broadcast(Actions.HistoryHide);
    };

    export const setLang = (lang: string = "fi") => {
        if (_.isString(lang)) {
            i.$rootScope.$broadcast(Actions.HistorySetLang, lang);
        }
        else {
            console.error("Not a proper lang", lang);
        }
    };

    export const clearObj = () => {
        i.$rootScope.$broadcast(Actions.HistoryClearObj);
    };

    export const setObj = (data: { [lang: string]: string }) => {
        i.$rootScope.$broadcast(Actions.HistorySetObj, data);
    };

    export const findByTunniste = (obj: Object, tunniste: string) => {
        const cache = {}; // Cycle detection
        const stack = [obj]; // Recursion elimination

        while (stack.length > 0) {
            const head = stack.shift();

            if (!_.isObject(head)) {
                continue;
            }

            if (head._tunniste === tunniste) {
                return head;
            }
            else {
                for (const key in head) {
                    if (_.isArray(head[key])) {
                        stack.push(head[key]);
                    }
                    else if (_.isObject(head[key])) {
                        const id = head[key].id || head[key]._id;

                        if (id && !(id in cache)) {
                            cache[id] = true;
                            stack.push(head[key]);
                        }
                    }
                }
            }
        }
    };

};

namespace FloatingWindow {
}

angular.module("app")
.run(HistoryModal.init)
.directive("floatingWindow", () => {
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        template: ""
            + "<div class='floating-window'>"
            + "  <div ng-transclude></div>"
            + "</div>",
        link: (scope, el) => {
            el.draggable({
                containment: "window",
                handle: "h2",
                opacity: 0.65,
                zindex: 99999
            });
        }
    };
})
.directive("historyModal", ($timeout) => {
    return {
        scope: {
            versions: "=",
            endpoint: "="
        },
        restrict: "E",
        templateUrl: "components/history/history.jade",
        controller: ($scope, $timeout) => {
            const cleanTeksti = (richText: string): string => {
                let result = richText;
                result = S(result).stripTags().s.replace(/\n/g, " ").replace(/  /g, " ");
                return result;
            };

            const getVersion = (modelValue?): Promise<any> => new Promise((resolve, reject) => {
                if (!_.isNumber(modelValue)) {
                    modelValue = $scope.historySlider.value;
                }

                if (!$scope.$$show || !$scope.data || !$scope.data._tunniste) {
                    return reject();
                }

                if ($scope.currentHistory && $scope.currentHistoryIdx === modelValue) {
                    $scope.currentHistoryItem = HistoryModal.findByTunniste($scope.currentHistory.plain(), $scope.data._tunniste);
                    return resolve();
                }
                else {
                    const meta = $scope.versions[$scope.versions.length - modelValue];
                    return $scope.endpoint.all("versiot").get(meta.id)
                        .then(res => {
                            // TODO: Cache history result
                            $scope.currentHistoryMeta = meta;
                            $scope.currentHistory = res;
                            $scope.currentHistoryItem = HistoryModal.findByTunniste(res.plain(), $scope.data._tunniste);
                            $scope.currentHistoryIdx = modelValue;
                            return resolve();
                        });
                }
            });

            const doDiff = (oldVersion?, newVersion?) => {
                oldVersion = oldVersion || $scope.currentHistoryItem;
                newVersion = newVersion || $scope.data;

                if (!oldVersion || !oldVersion[$scope.selectedLang]) {
                    $scope.eiVanhaaVersiota = true;
                    return;
                }

                $scope.vanhaTeksti = cleanTeksti(oldVersion[$scope.selectedLang]);
                $scope.eiVanhaaVersiota = false;

                const sentenceDiff = JsDiff.diffSentences(
                    cleanTeksti(oldVersion[$scope.selectedLang]),
                    cleanTeksti(newVersion[$scope.selectedLang]));

                let diff = [];
                let idx = 0;

                while (idx < sentenceDiff.length) {
                    if (sentenceDiff[idx].removed && idx < sentenceDiff.length - 1 && sentenceDiff[idx + 1].added) {
                        const oldValue = sentenceDiff[idx].value;
                        const newValue = sentenceDiff[idx + 1].value;
                        const wDiff = JsDiff.diffWords(oldValue, newValue);
                        _.each(wDiff, (value) => {
                            diff.push(value);
                        });
                        idx += 2; // Skip removed part
                    }
                    else {
                        diff.push(sentenceDiff[idx]);
                        ++idx;
                    }
                }

                $scope.diff = diff;
            };

            $scope.naytaDiffi = true;
            $scope.$$show = false;
            $scope.langs = KieliService.getSisaltokielet();
            $scope.selectedLang = KieliService.getSisaltokieli();
            $scope.langIdx = 0;
            $scope.nextLang = (lang) => {
                $timeout(() => {
                    $scope.langIdx = ($scope.langIdx + 1) % _.size($scope.langs);
                    $scope.selectedLang = $scope.langs[$scope.langIdx];
                });
            };

            $scope.historySlider = {
                value: $scope.versions.length - 1,
                options: {
                    floor: 1,
                    ceil: $scope.versions.length,
                    onEnd: _.debounce((sliderId, modelValue) => {
                        getVersion(modelValue)
                            .then(() => $timeout(() => doDiff()))
                            .catch(_.noop);
                    }, 300)
                }
            };

            $scope.$on(Actions.HistoryShow, () => {
                $scope.$$show = true;
                $timeout(() => $scope.$broadcast("rzSliderForceRender"));
            });

            $scope.$on(Actions.HistoryHide, () => {
                $scope.$$show = false;
            });

            $scope.$on(Actions.HistorySetLang, (ev, lang) => {
            });

            $scope.$on(Actions.HistoryClearObj, (ev, data) => {
            });

            $scope.$on(Actions.HistorySetObj, (ev, data) => {
                $timeout(() => {
                    if (data && data._tunniste) {
                        $scope.data = data;
                        getVersion()
                            .then(() => $timeout(doDiff()))
                            .catch(_.noop);
                    }
                });
            });
        },
        link: (scope, el) => {
        }
    };
});
