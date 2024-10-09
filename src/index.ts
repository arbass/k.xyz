// import { func_draggableElem } from '$utils/draggable-elements';
// import { func_interactiveZone } from '$utils/interactive-zone';
import { func_heroForm } from '$utils/hero-form';
import { func_mindConnections } from '$utils/mind-connections';

window.Webflow ||= [];
window.Webflow.push(() => {
  func_mindConnections();
  // func_draggableElem();
  // func_interactiveZone();
  func_heroForm();
});
