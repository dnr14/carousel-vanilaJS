class InfiniteSlide {

  constructor(sliderWrapId, sliderId, rightButtonsId, leftButtonsId) {
    this.sliderWrap = document.getElementById(sliderWrapId);
    this.slider = document.getElementById(sliderId);
    this.rightButton = document.getElementById(rightButtonsId);
    this.leftButton = document.getElementById(leftButtonsId);
    this.btnPlayOrPause = document.getElementById('btnPlayOrPause');
    this.pageNumber = document.getElementById('pageNumber');
    this.isBtnPlayOrPause = true;

    this.pageWidth = this.sliderWrap.clientWidth;
    this.pageArray = [...this.slider.children];
    this.totalPage = this.pageArray.length;

    this.buttonStop = true;
    this.pageIdx = 0;
    this.setTimeOutTime1 = 500;
    this.setTimeOutTime2 = 50;
    this.loopTime = 2000;
    this.transitionTime = `500ms`;

    this.init();
  }

  init() {

    if (this.totalPage > 1) {
      const cloneFirstPage1 = this.pageArray[0].cloneNode(true);
      const cloneFirstPage2 = this.pageArray[1].cloneNode(true);
      const cloneLastPage1 = this.pageArray[this.pageArray.length - 1].cloneNode(true);
      const cloneLastPage2 = this.pageArray[this.pageArray.length - 2].cloneNode(true);
      this.slider.appendChild(cloneFirstPage1);
      this.slider.appendChild(cloneFirstPage2);
      this.slider.insertBefore(cloneLastPage2, this.pageArray[0]);
      this.slider.insertBefore(cloneLastPage1, this.pageArray[0]);
      this.pageArray.push(cloneFirstPage1);
      this.pageArray.push(cloneFirstPage2);
      this.pageArray.unshift(cloneLastPage1);
      this.pageArray.unshift(cloneLastPage2);
    }

    this.slider.style.width = `${this.pageArray.length * this.pageWidth}px`;
    this.pageArray.forEach(page => page.style.width = `${this.pageWidth}px`);
    this.pageArray.forEach(page => page.style.transform = `translateX(-${(this.pageWidth * (this.pageIdx + 2))}px)`);
    this.pageArray.forEach(page => page.style.transition = this.transitionTime);
    this.pageIdx = 2;

    this.eventHandler();
    this.paginationNumberRender();
    this.setLoop();
  }

  rightBtnEvent = () => {

    if (this.buttonStop) {

      if (this.pageIdx < this.pageArray.length - 1) {
        this.pageArray.forEach(page => page.style.transform = `translateX(-${(this.pageWidth * (this.pageIdx + 1))}px)`);
        this.pageIdx++;


        if (this.pageIdx === this.pageArray.length - 2) {
          this.buttonStop = false;
          setTimeout(() => {
            this.pageArray.forEach(page => {
              page.style.transition = "0ms";
              page.style.transform = `translateX(-${this.pageWidth * 2}px)`;
            });

            setTimeout(() => {
              this.pageArray.forEach(page => page.style.transition = this.transitionTime);
              this.buttonStop = true;
            }, this.setTimeOutTime2);
          }, this.setTimeOutTime1);

          this.pageIdx = 2;
        }
      }
      this.paginationNumberRender();

    }

  }

  leftBtnEvent = () => {
    if (this.buttonStop) {

      if (this.pageIdx > 0) {
        this.pageArray.forEach(page => page.style.transform = `translateX(-${(this.pageWidth * (this.pageIdx - 1))}px)`);
        this.pageIdx--;

        if (this.pageIdx === 1) {
          this.buttonStop = false;
          setTimeout(() => {
            this.pageArray.forEach(page => {
              page.style.transition = "0ms";
              page.style.transform = `translateX(-${this.pageWidth * (this.pageArray.length - 3)}px)`;
            });

            setTimeout(() => {
              this.pageArray.forEach(page => page.style.transition = this.transitionTime);
              this.buttonStop = true;
            }, this.setTimeOutTime2);
          }, this.setTimeOutTime1);

          this.pageIdx = this.pageArray.length - 3;
        }
      }
      this.paginationNumberRender();

    }

  }


  eventHandler() {
    this.rightButton.addEventListener('click', this.rightBtnEvent);
    this.leftButton.addEventListener('click', this.leftBtnEvent);
    this.btnPlayOrPause.addEventListener('click', this.btnPlayOrPauseEv);
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

  btnPlayOrPauseEv = () => {
    const btn = this.btnPlayOrPause;

    if (btn.classList.contains('btnPlay')) {
      btn.classList.remove('btnPlay');
      btn.classList.add('btnPause');
    } else {
      btn.classList.remove('btnPause');
      btn.classList.add('btnPlay');
    }
    this.isBtnPlayOrPause = !this.isBtnPlayOrPause;

  }
  paginationNumberRender = () => {
    this.pageNumber.innerHTML = `<strong>${this.pageIdx - 1} </strong>/ ${this.pageArray.length - 4}`;
  }

  setLoop() {
    this.timer = setInterval(() => { this.isBtnPlayOrPause ? this.rightBtnEvent() : "" }, this.loopTime);
  }
}

const infiniteSlide = new InfiniteSlide("TopsliderWrap", "Topslider", "TopSlideBtnNext", "TopSlideBtnPrev");
