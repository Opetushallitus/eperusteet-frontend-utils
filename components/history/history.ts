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


namespace HistoryModal {
    let i;
    export const init = ($injector) => {
        i = inject($injector, ["$rootScope", "$uibModal", "$q"]);
    };

    const controllerImpl = ($scope) => {
    };

    export const dialogi = () => i.$q((resolve, reject) =>
        i.$uibModal.open({
            templateUrl: "components/history/history.jade",
            controller: controllerImpl,
            resolve: {
            }
        })
        .result.then(resolve, reject));

    // export const
};


angular.module("app")
.run(HistoryModal.init)
