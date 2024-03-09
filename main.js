class sidebarReflect {
 constructor(params){
  this.isScrollUp = false;
  this.sidebarElm = document.querySelector(params.sidebarElm) ? document.querySelector(params.sidebarElm) : null;
  this.listElms =  document.querySelectorAll(params.listElms) ? document.querySelectorAll(params.listElms) : null;
 } 

  detectScrollDirection (){
    let lastScrollTop = 0;
    let _self = this;
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.scrollY;
        if (currentScrollTop > lastScrollTop) {
            _self.isScrollUp = false;
        } else if (currentScrollTop < lastScrollTop) {
          _self.isScrollUp = true;
        }
        lastScrollTop = currentScrollTop;
    });
  }
  
  getCenterMostElement(listsItem) {
    const viewportHeight = window.innerHeight;

    let closestElement = null;
    let minDistance = Infinity;
    for (const item of listsItem) {
      const rect = item.elementRect;

      const elementCenterY = rect.top + rect.height / 2;

      const distance = Math.abs(elementCenterY - viewportHeight / 2);

      if (distance < minDistance) {
        minDistance = distance;
        closestElement = item;
      }
    }
    return closestElement;
  }

  firstActive(){
    let _self = this;
    let slideInView = [];
    let windownHeight = window.innerHeight;

    _self.listElms.forEach((element) => {
      let elementRect = element.getBoundingClientRect();  
      if(elementRect.bottom > 200 &&  elementRect.bottom - windownHeight  < elementRect.height - 200) {
        slideInView.push({element,isInView:true,elementRect})
      }
    });
    let willActiveEle = _self.getCenterMostElement(slideInView).element;
    console.log(willActiveEle);
    if(willActiveEle == null) return;

    let currentActiveEle = document.querySelector('.plan.active');
    if(willActiveEle == currentActiveEle) return; 

    let imageSrc =  willActiveEle.getAttribute('data-src');
    _self.sidebarElm.setAttribute('src',imageSrc);
    currentActiveEle.classList.remove('active');
    willActiveEle.classList.add('active')
  }

  init(){
    let _self = this;
    if(_self.sidebarElm == null || _self.listElms == null ) return;
    _self.detectScrollDirection();

    window.addEventListener('scroll',function(){
      let slideInView = [];
      let windownHeight = window.innerHeight;

      _self.listElms.forEach((element) => {
        let elementRect = element.getBoundingClientRect();


        if(elementRect.bottom > 200 &&  elementRect.bottom - windownHeight  < elementRect.height - 200) {
          slideInView.push({element,isInView:true,elementRect})
        }

      });
      if(slideInView.length > 0) {
        let willActiveEle = null;

        if(slideInView.length == 1) {willActiveEle = slideInView[0].element};
        if(slideInView.length == 2) {
          let indexCurrentActiveEle = slideInView.findIndex((slide)=> slide.element.classList.contains('active'));

          willActiveEle = _self.isScrollUp ? 
          (slideInView[indexCurrentActiveEle - 1] ? slideInView[indexCurrentActiveEle - 1].element : slideInView[indexCurrentActiveEle].element ) : 
          (slideInView[indexCurrentActiveEle + 1] ? slideInView[indexCurrentActiveEle + 1].element : slideInView[indexCurrentActiveEle].element );
        }
        if(slideInView.length >= 3) {
          willActiveEle = _self.getCenterMostElement(slideInView).element;
        }

        if(willActiveEle == null) return;

        
        let currentActiveEle = document.querySelector('.plan.active');
        if(willActiveEle == currentActiveEle) return; 

        let imageSrc =  willActiveEle.getAttribute('data-src');
        _self.sidebarElm.setAttribute('src',imageSrc);
        currentActiveEle.classList.remove('active');
        willActiveEle.classList.add('active')
      }
    })

    _self.firstActive()
    
  }

}

window.addEventListener('load',function(){
  new sidebarReflect(params={
    sidebarElm:"#navImg",
    listElms:".plan"
  }).init();
  
})





/*
let plans = document.querySelectorAll('.plan');
window.addEventListener('scroll',function(){
    plans.forEach((element)=>{
        const elementRect = element.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        if(viewHeight - elementRect.top <= 200){
            console.log(element.className);
        }
    })
})

*/


/* 

let navImg = document.querySelector('#navImg');
const elements = document.querySelectorAll('.plan');

let navImg = document.querySelector('#navImg');
let elements = document.querySelectorAll('.plan');


const options = {
    root: null, // Observe viewport by default
    threshold: 0.5, // Intersection ratio at 50% (element middle)
  };
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let currentActive = document.querySelector('.plan.active');
        if(currentActive) {
            currentActive.classList.remove('active');
        }
        let src = entry.target.getAttribute('data-src');
        entry.target.classList.add('active')
        navImg.setAttribute('src',src)
      }
    });
  }, options);

  elements.forEach((element)=>{

      observer.observe(element);
  })


*/