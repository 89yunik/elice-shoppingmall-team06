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
        (data, index) =>
          `<a class='menu-card' data-index="${index}">
            <div class="menu-icon">
              <span class="icon has-text-info">
                <i class="fa-solid fa-credit-card"></i>
              </span>
            </div>
            <div class="menu-body">
              <p class="title is-3">${data.title}</p>
              <p class="subtitle is-5">${data.subtitle}</p>
            </div>
          </a>`,
      )
      .join('');
  };

  this.render();
}
