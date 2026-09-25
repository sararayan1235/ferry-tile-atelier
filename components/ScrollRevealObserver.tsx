'use client';
import { useEffect } from 'react';

export function ScrollRevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px'
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      // Cleanup observer when component unmounts
      elements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);
  
  return null;
}