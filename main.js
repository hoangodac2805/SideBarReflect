class SidebarReflect {
  constructor(params){
   this.isScrollUp = false;
   this.sidebarElm = document.querySelector(params.sidebarElm) || null;
   this.listElms =  document.querySelectorAll(params.listElms) || null;
  } 
 
   detectScrollDirection (){
     let lastScrollTop = 0;
     let _self = this;
     window.addEventListener('scroll', function() {
         const currentScrollTop = window.scrollY;
         _self.isScrollUp = currentScrollTop < lastScrollTop;
         lastScrollTop = currentScrollTop;
     });
   }
   
   getCenterMostElement(listsItem) {
     if(!listsItem) return;
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
       let minusHeight = Math.min(100,elementRect.height / 2);
         if(elementRect.bottom > minusHeight &&  elementRect.bottom - windownHeight  < elementRect.height - minusHeight) {
         slideInView.push({element,isInView:true,elementRect})
       }
     });
     let willActiveEle = _self.getCenterMostElement(slideInView)?.element;
 
     if(willActiveEle == null) return;
 
     let currentActiveEle = document.querySelector('.plan.active');
     if(willActiveEle == currentActiveEle) return; 
 
     _self.updateSidebar(willActiveEle);
   }
 
   updateSidebar(willActiveEle) {
     let _self = this;
     let imageSrc =  willActiveEle.getAttribute('data-src');
     _self.sidebarElm.setAttribute('src',imageSrc);
     document.querySelector('.plan.active').classList.remove('active');
     willActiveEle.classList.add('active');
   }
 
   init(){
     let _self = this;
     if(_self.sidebarElm == null || _self.listElms == null ) return;
     _self.detectScrollDirection();
     _self.firstActive()
 
     window.addEventListener('scroll',function(){
       let slideInView = [];
       let windownHeight = window.innerHeight;
 
       _self.listElms.forEach((element) => {
         let elementRect = element.getBoundingClientRect();
          let minusHeight = Math.min(100,elementRect.height / 2);
         if(elementRect.bottom > minusHeight &&  elementRect.bottom - windownHeight  < elementRect.height - minusHeight) {
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
           let centralSlide = _self.getCenterMostElement(slideInView);
           let indexCurrentActiveEle = slideInView.findIndex((slide)=> slide.element.classList.contains('active'));
           let indexCentralSlide= slideInView.findIndex((slide)=> slide == centralSlide);
           if(_self.isScrollUp){
             if(indexCurrentActiveEle - indexCentralSlide > 0){
               willActiveEle = centralSlide.element;
             }
           }else{
             if(indexCurrentActiveEle - indexCentralSlide < 0){
               willActiveEle = centralSlide.element;
             }
           }
         }
 
         if(willActiveEle == null) return;
 
         let currentActiveEle = document.querySelector('.plan.active');
         if(willActiveEle == currentActiveEle) return; 
 
         _self.updateSidebar(willActiveEle);
       }
     })
   }
 }
 
 window.addEventListener('load',function(){
   new SidebarReflect({
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