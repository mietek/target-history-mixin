"use strict";

module.exports = {
  componentDidMount: function () {
    this._thm_isEnabled = (
      this.props.initialTarget &&
      this.props.encodeTarget &&
      this.props.decodeTarget);
    if (this._thm_isEnabled) {
      var target = (
        this.props.decodeTarget(location.hash) ||
        this.props.initialTarget);
      var hash = this.props.encodeTarget(target);
      history.replaceState({
          target: target
        }, "", hash);
      this._thm_currentTarget = target;
      this._thm_isPushedTarget = false;
      addEventListener("popstate", this.onPopState);
    }
  },

  componentWillUnmount: function () {
    if (this._thm_isEnabled) {
      removeEventListener("popstate", this.onPopState);
    }
  },

  onPopState: function (event) {
    if (this._thm_isEnabled) {
      var target = (
        (event.state && event.state.target) ||
        this.props.decodeTarget(location.hash));
      if (target) {
        this._thm_currentTarget = target;
        this._thm_isPushedTarget = false;
        if (this.onPopTarget) {
          this.onPopTarget(target);
        }
      }
    }
  },

  pushTarget: function (target) {
    var currentHash = this.props.encodeTarget(this._thm_currentTarget);
    var hash = this.props.encodeTarget(target);
    if (hash !== currentHash) {
      if (!this._thm_isPushedTarget) {
        history.pushState({
            target: target
          }, "", hash);
      } else {
        history.replaceState({
            target: target
          }, "", hash);
      }
      this._thm_currentTarget = target;
      this._thm_isPushedTarget = true;
    }
  },

  getCurrentTarget: function () {
    return this._thm_currentTarget;
  }
};
