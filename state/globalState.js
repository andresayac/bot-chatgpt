import { readFileSync, writeFileSync, existsSync } from 'fs';

class GlobalState {
  constructor() {
    if (!GlobalState.instance) {
      this._data = this.loadState(); // Load the state when the application starts
      GlobalState.instance = this;
    }

    return GlobalState.instance;
  }

  set(key, val) {
    this._data[key] = val;
    this.saveState(); // Save the state every time it is modified
  }

  get(key) {
    return this._data[key];
  }

  update(key, newVal) {
    if (this._data[key]) {
      this._data[key] = { ...this._data[key], ...newVal };
    } else {
      this._data[key] = newVal;
    }
    this.saveState(); // Save the state every time it is modified
  }

  // Save the state to a JSON file
  saveState() {
    writeFileSync('state.json', JSON.stringify(this._data));
  }

  //Load the state from a JSON file
  loadState() {
    if (existsSync('state.json')) {
      const stateData = readFileSync('state.json');
      return JSON.parse(stateData);
    } else {
      return {}; // Returns an empty state if the file does not exist
    }
  }
}

const instance = new GlobalState();
Object.freeze(instance);

export default instance;