// actions
export {
	addTariff,
	deleteTariff,
	updateActive,
	updateTariff,
} from './tariffsManagmentSlice';

// selectors
export { selectTariffs } from './tariffsManagmentSlice';

// reducer
export { default as tariffsManagmentReducer } from './tariffsManagmentSlice';
