import { func_draggableElem } from '$utils/draggable-elements';
import { func_mindConnections } from '$utils/mind-connections';

window.Webflow ||= [];
window.Webflow.push(() => {
  func_mindConnections();
  func_draggableElem();
});
