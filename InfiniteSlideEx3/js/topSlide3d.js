class _3DInfiniteSlide {

  constructor(sliderWrapId, sliderId, rightButtonsClassName, leftButtonsClassName) {
    this.sliderWrap = document.getElementById(sliderWrapId);
    this.slider = document.getElementById(sliderId);
    this.rightButtons = document.querySelectorAll(`.${rightButtonsClassName}`);
    this.leftButtons = document.querySelectorAll(`.${leftButtonsClassName}`);
    console.log(this.rightButtons, this.leftButtons);

    this.pageArray = [...this.slider.children];
    this.pageWidth = this.sliderWrap.clientWidth;
    this.totalPage = this.pageArray.length;

    this.buttonStop = true;
    this.pageIdx = 0;
    this.setTimeOutTime1 = 500;
    this.setTimeOutTime2 = 100;
    this.loopTime = 4000;
    this.transitionTime = `0.5s`;
    this.current = null;

    this.init();
  }

  init() {

    if (this.totalPage > 1) {
      this.transformOffset = (this.pageWidth * 2);
      this.slider.style.transform = `translate3d(-${this.transformOffset}px, 0px, 0px)`;
      this.pageArray.forEach(page => page.style.transition = this.transitionTime);
    }

    this.slider.style.width = `${(this.pageArray.length * this.pageWidth)}px`;
    this.slider.style.transition = this.transitionTime;
    this.pageIdx++;
    this.setTransform();
    this.createPaginaition();
    this.eventHandler();
    this.setLoop();
  }

  rightBtnEvent = (e) => {

    if (this.buttonStop) {

      if (this.pageIdx < this.pageArray.length - 1) {
        this.slider.style.transform = `translate3d(-${(this.pageWidth * this.pageIdx) + this.transformOffset}px, 0px , 0px)`;
        this.pageIdx++;
        this.setTransform();

        if (this.pageIdx === (this.totalPage - 3)) {
          this.buttonStop = false;

          setTimeout(() => {

            this.pageArray.forEach(page => page.style.transition = "0ms");
            this.setTransform();
            this.slider.style.transition = "0ms";
            this.slider.style.transform = `translate3d(-${this.transformOffset}px, 0px, 0px)`;

            setTimeout(() => {
              this.slider.style.transition = this.transitionTime;
              this.pageArray.forEach(page => page.style.transition = this.transitionTime);
              this.buttonStop = true;
            }, this.setTimeOutTime2);
          }, this.setTimeOutTime1);
          this.pageIdx = 1;
        }
      }
      this.paginationRender();

    } else {
      if (!e)
        e.preventDefault();

      return;
    }

  }


  leftBtnEvent = (e) => {
    if (this.buttonStop) {

      if (this.pageIdx > 0) {
        this.slider.style.transform = `translate3d(-${(this.pageWidth * (this.pageIdx - 2)) + this.transformOffset}px, 0px, 0px)`;
        this.pageIdx--;
        this.setTransform();

        if (this.pageIdx === 0) {
          this.buttonStop = false;

          setTimeout(() => {
            this.pageArray.forEach(page => page.style.transition = "0ms");
            this.setTransform();
            this.slider.style.transition = "0ms";
            this.slider.style.transform = `translate3d(-${(this.pageWidth * 2) + this.transformOffset}px, 0px, 0px)`;

            setTimeout(() => {
              this.slider.style.transition = this.transitionTime;
              this.pageArray.forEach(page => page.style.transition = this.transitionTime);
              this.buttonStop = true;
            }, this.setTimeOutTime2);
          }, this.setTimeOutTime1);

          this.pageIdx = (this.totalPage - 4);
        }
      }
      this.paginationRender();

    } else {
      e.preventDefault();
      return;
    }

  }

  setTransform() {
    this.pageArray[this.pageIdx].style.transform = `perspective(104px) rotatey(4deg) translateX(200px)`;
    this.pageArray[this.pageIdx].style.opacity = `.5`;
    this.pageArray[this.pageIdx + 1].style.transform = `perspective(0) rotatey(0) translateX(0)`;
    this.pageArray[this.pageIdx + 1].style.opacity = `1`;
    this.pageArray[this.pageIdx + 2].style.transform = `perspective(104px) rotatey(-4deg) translateX(-200px)`;
    this.pageArray[this.pageIdx + 2].style.opacity = `.5`;
  }

  createPaginaition() {
    const div = document.createElement('div');
    div.id = "pagination";
    const endLeng = Math.floor(this.pageArray.length / 2);
    for (let i = 0; i < endLeng; ++i) {
      const span = document.createElement('span');
      span.classList.add('bullet');
      if (i === 0) {
        span.classList.add('active');
        this.current = span;
      }

      span.dataset.tableIdx = i;
      span.addEventListener('click', this.paginationEvent);
      div.appendChild(span);

    }

    this.sliderWrap.appendChild(div);
  }

  paginationEvent = (e) => {
    const { currentTarget } = e;
    const { tableIdx } = currentTarget.dataset;
    this.pageIdx = Number(tableIdx);

    if (this.current !== null)
      this.current.classList.remove('active');

    currentTarget.classList.add('active');
    this.current = currentTarget;

    this.rightBtnEvent();
  }

  paginationRender() {
    const pagination = this.sliderWrap.querySelector('#pagination');
    const { children } = pagination;
    const childrenArray = [...children];

    childrenArray.forEach(span => {
      const { tableIdx } = span.dataset;
      if ((this.pageIdx - 1) === Number(tableIdx)) {

        if (this.current !== null) {
          this.current.classList.remove('active');
        }

        span.classList.add('active');
        this.current = span;
      }
    });

  }

  eventHandler() {
    this.rightButtons.forEach(button => button.addEventListener('click', this.rightBtnEvent));
    this.leftButtons.forEach(button => button.addEventListener('click', this.leftBtnEvent));
    window.addEventListener('resize', this.optimizeAnimation(this.resize));
  }

  // 매번 resize시 실행
  resize = () => {
    this.pageIdx = 1;
    this.pageArray.forEach(page => page.style.transition = "0ms");
    this.slider.style.transition = "0ms";
    this.slider.style.transform = `translate3d(-${this.transformOffset}px, 0px, 0px)`;
    this.setTransform();
    this.paginationRender();

    if (this._resizeTo) {
      clearTimeout(this._resizeTo);
    }
    this._resizeTo = setTimeout(() => {
      this.slider.style.transition = this.transitionTime;
      this.pageArray.forEach(page => page.style.transition = this.transitionTime);
    }, 500);
  }

  // 1초에 최대 60번 실행
  // 60 프레임
  optimizeAnimation = (callback) => {
    let ticking = false;
    return (e) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          callback(e);
          ticking = false;
        });
      }
    };
  }
  setLoop() {
    this.timer = setInterval(() => this.rightBtnEvent(), this.loopTime);
  }
}

//개선 사항 
// 1260px 이하로 내려갓을때 3d가 아닌 2d로 보여줄수 잇는지 개발

const top3dInfiniteSlide = new _3DInfiniteSlide("top_slide_3d_wrap", "top_slide_3d", "top_3d_btn_right", "top_3d_btn_left");

