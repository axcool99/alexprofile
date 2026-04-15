document.addEventListener("DOMContentLoaded", (event) => {
  
  // 1. Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP is not loaded! Make sure to add the library links.");
    return;
  }
  
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById("enquiry-newsletter-section");
  const enquiryCard = document.getElementById("enquiry-card");
  const newsletterCard = document.getElementById("newsletter-card");

  // 2. Set Initial States (Crucial for the logic to work)
  // Newsletter starts pushed down (100%) and slightly faded
  gsap.set(newsletterCard, { 
    yPercent: 100,
    opacity: 0
  }); 
  
  // Enquiry starts at normal size
  gsap.set(enquiryCard, { 
    scale: 1, 
    filter: "brightness(1)" 
  });

  // 3. Create the Timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",      // When top of section hits top of viewport
      end: "+=1000",         // Duration of the pin (pixels scrolled)
      scrub: 1,              // Smooth scrubbing (1 second lag)
      pin: true,             // Pin the section
      anticipatePin: 1
    }
  });

  // Animation Step 1: Shrink & Darken Enquiry Card
  tl.to(enquiryCard, { 
    scale: 0.92, 
    filter: "brightness(0.4)", 
    duration: 1,
    ease: "power1.inOut"
  }, 0); 

  // Animation Step 2: Slide Newsletter Card Up
  tl.to(newsletterCard, { 
    yPercent: 0,
    opacity: 1,
    duration: 1,
    ease: "power2.out"
  }, 0.15); // Start slightly after the first animation begins

});