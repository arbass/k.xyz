// import { func_draggableElem } from '$utils/draggable-elements';
// import { func_interactiveZone } from '$utils/interactive-zone';
import { func_buttonTextToggl } from '$utils/button-text-toggl';
import { func_collapseButtons } from '$utils/collapse-buttons';
import { func_heightTransition } from '$utils/height-transition';
import { func_heroForm } from '$utils/hero-form';
// import { func_mindConnections } from '$utils/mind-connections';
import { func_mindConnectionsLeader } from '$utils/mind-connections-leader';
import { func_statsHero } from '$utils/stats-hero';
import { func_syncClick } from '$utils/sync-click';
import { func_togglClassTriggerTarget } from '$utils/toggl-class-trigger-target';
import { func_yearCounter } from '$utils/year-counter';

window.Webflow ||= [];
window.Webflow.push(() => {
  // func_mindConnections();
  // func_draggableElem();
  // func_interactiveZone();
  func_heroForm();
  func_collapseButtons();
  func_heightTransition();
  func_syncClick();
  func_buttonTextToggl();
  func_statsHero();
  func_yearCounter();
  func_togglClassTriggerTarget();
  func_mindConnectionsLeader();
});
