export default function Menu({ $app, initialState = [] }) {
  this.state = initialState;
  this.$target = document.createElement('div');
  this.$target.className = 'menu-container';

  $app.appendChild(this.$target);

  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    this.$target.innerHTML = this.state
      .map(
        (node, index) =>
          `<div class='menu-card' data-index="${index}">${node.name}</div>`,
      )
      .join('');
  };

  this.render();
}
