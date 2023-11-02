import _ from 'lodash';

export function unescapeStringHtml(str: string | null, element: any = document.createElement('textarea')) {
  if (!_.isString(str)) {
    return str;
  }

  if (!str) {
    return '';
  }
  else {
    element.innerHTML = str;
    return element.textContent;
  }
}
