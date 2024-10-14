// import { func_draggableElem } from '$utils/draggable-elements';
// import { func_interactiveZone } from '$utils/interactive-zone';
import { func_buttonTextToggl } from '$utils/button-text-toggl';
import { func_collapseButtons } from '$utils/collapse-buttons';
import { func_heightTransition } from '$utils/height-transition';
import { func_heroForm } from '$utils/hero-form';
import { func_mindConnections } from '$utils/mind-connections';
import { func_syncClick } from '$utils/sync-click';

window.Webflow ||= [];
window.Webflow.push(() => {
  func_mindConnections();
  // func_draggableElem();
  // func_interactiveZone();
  func_heroForm();
  func_collapseButtons();
  func_heightTransition();
  func_syncClick();
  func_buttonTextToggl();
});
