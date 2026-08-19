'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, MorphSVGPlugin, useGSAP);

export { gsap, ScrollSmoother, ScrollTrigger, useGSAP };
