"use strict";(()=>{var e={};e.id=951,e.ids=[951],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4679:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>y,patchFetch:()=>k,requestAsyncStorage:()=>m,routeModule:()=>h,serverHooks:()=>g,staticGenerationAsyncStorage:()=>u});var i={};a.r(i),a.d(i,{GET:()=>p,dynamic:()=>c,runtime:()=>l});var r=a(3036),n=a(5736),o=a(5262),s=a(942),d=a(6783);let l="nodejs",c="force-dynamic";async function p(){try{let e=await fetch(d.JA.resumeUrl,{headers:{"User-Agent":"Mozilla/5.0 (compatible; SabbirPortfolio/1.0; +https://sabbirhossen.dev)"},cache:"no-store"});if(!e.ok)return s.NextResponse.json({error:`Upstream responded with ${e.status}`},{status:502});let t=await e.arrayBuffer(),a=new Uint8Array(t);return new s.NextResponse(a,{status:200,headers:{"Content-Type":e.headers.get("Content-Type")??"application/pdf","Content-Disposition":'attachment; filename="sabbir-hossen-resume.pdf"',"Cache-Control":"public, max-age=0, must-revalidate"}})}catch(e){return s.NextResponse.json({error:"Failed to fetch resume.",detail:e instanceof Error?e.message:String(e)},{status:500})}}let h=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/resume/route",pathname:"/api/resume",filename:"route",bundlePath:"app/api/resume/route"},resolvedPagePath:"/Users/sabbirhossen/Desktop/Learning/portfolio/apps/frontend/app/api/resume/route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:m,staticGenerationAsyncStorage:u,serverHooks:g}=h,y="/api/resume/route";function k(){return(0,o.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:u})}},6783:(e,t,a)=>{a.d(t,{Ey:()=>y,Fw:()=>w,HG:()=>f,JA:()=>g,Nj:()=>k,UO:()=>b});var i=a(5980),r=a(8922),n=a(6233),o=a(7365),s=a(3884),d=a(9182),l=a(7279),c=a(5220),p=a(2714),h=a(3782),m=a(5640),u=a(9925);let g={name:"Sabbir Hossen",role:"Full-Stack MERN Developer",tagline:"I build scalable, production-grade web applications with React, Next.js, and Node.js.",description:"Portfolio of Sabbir Hossen — Front-End Engineer specializing in React, Next.js, TypeScript, and Node.js. Building scalable, accessible, and high-performance web products.",url:"https://sabbirhossen.dev",location:"Available Worldwide \xb7 Remote-First",email:"sabbirhossen.eng66@gmail.com",phone:"+880 1783780066",whatsappNumber:"8801783780066",whatsappMessage:"Hi Sabbir! I just saw your portfolio and I'd love to chat about a project.",resumeUrl:"https://drive.google.com/uc?export=download&id=1yHm3ZSBRiqZZNqaOqrf_5cv30GJRvjM1",resumePreviewUrl:"https://drive.google.com/file/d/1yHm3ZSBRiqZZNqaOqrf_5cv30GJRvjM1/view?usp=sharing",ogImage:"/og.png",socials:{github:"https://github.com/sabbir-hossen66",linkedin:"https://www.linkedin.com/in/sabbir-hossen66/",twitter:"https://twitter.com/sabbirhossen"}},y=g,k=[{value:"2+",label:"Years Experience"},{value:"30+",label:"Projects Shipped"},{value:"2",label:"Countries Served"},{value:"MERN",label:"Core Stack"}],b=[{company:"Sofof Tech",role:"Front-End Engineer",period:"August 2025 — Present",location:"Remote ",country:"Saudi Arabia",current:!0,highlights:["Collaborated closely with the backend team to ensure smooth and efficient API integration.","Delivered high-priority front-end features within tight deadlines without compromising quality.","Designed and implemented unique UI/UX solutions independently, without relying on Figma or predefined designs.","Built AI-agent–based front-end websites from scratch with a strong focus on usability and performance.","Worked closely with back-end developers to integrate complex, large-scale APIs across multiple products.","Developed a real-time voice communication widget using the LiveKit framework.","Actively fixed bugs and supported other developers with Git-related issues.","Contributed across multiple projects including SaaS platforms, CRM systems, and other web applications."],stack:["React","Next.js","TypeScript","Tailwind CSS","LiveKit","REST APIs","Git"]},{company:"Next Level Bangladesh",role:"Front-End Engineer",period:"April 2025 — 31 August 2025",location:"On-site \xb7 Rajshahi, Bangladesh",country:"Bangladesh",current:!1,highlights:["Delivered high-priority front-end features under tight deadlines alongside the CTO.","Implemented pagination on large datasets, reducing load time by 40%.","Built reusable UI components (modals, forms) to reduce duplication and improve maintainability.","Reviewed pull requests to ensure clean, efficient, and maintainable code.","Fixed UI/UX bugs, improving dashboard usability for 1,000+ users."],stack:["React","Next.js","TypeScript","Tailwind CSS","REST APIs","Git"]},{company:"Longbitz",role:"Front-End Intern",period:"January 2025 — March 2025",location:"Internship \xb7 Dhaka, Bangladesh",country:"Bangladesh",current:!1,highlights:["Shipped UI components and fixes in a React/Next.js codebase during a 3-month internship.","Collaborated with senior engineers to translate Figma designs into responsive, accessible interfaces.","Practiced code review, PR hygiene, and feature-flag-based deployments."],stack:["React","Next.js","JavaScript","Tailwind CSS","Git"]}],f=[{name:"React / Next.js",icon:i.Z,category:"Frontend"},{name:"TypeScript",icon:i.Z,category:"Frontend"},{name:"Tailwind CSS",icon:r.Z,category:"Frontend"},{name:"Responsive UI",icon:n.Z,category:"Frontend"},{name:"Node.js",icon:o.Z,category:"Backend"},{name:"Nest.js (Learning)",icon:s.Z,category:"Backend"},{name:"Express.js",icon:o.Z,category:"Backend"},{name:"REST & GraphQL APIs",icon:d.Z,category:"Backend"},{name:"MongoDB",icon:l.Z,category:"Database"},{name:"Mongoose / Prisma",icon:l.Z,category:"Database"},{name:"Git & GitHub",icon:c.Z,category:"Tools"},{name:"Docker",icon:p.Z,category:"Tools"},{name:"CI/CD",icon:h.Z,category:"Tools"},{name:"JWT / OAuth / RBAC",icon:m.Z,category:"Security"},{name:"Performance & SEO",icon:u.Z,category:"Quality"}],w=[{title:"Enterprise CRM / SaaS Platform",description:"A multi-tenant CRM platform with role-based access, real-time dashboards, and a scalable Nest.js backend.",highlights:["Designed reusable UI primitives and a typed API contract layer.","Built real-time lead pipelines with optimistic updates.","Implemented strict RBAC and audit logging for enterprise compliance."],stack:["Next.js","Nest.js","MongoDB","TanStack Query","Tailwind"],featured:!0},{title:"Booking & Reservation System",description:"Full-stack booking platform with calendar sync, payments, and admin analytics.",highlights:["End-to-end MERN implementation with secure auth.","Integrated Stripe payments and webhook reconciliation.","Reduced admin workload by 60% via automation."],stack:["React","Node.js","Express","MongoDB","Stripe"],featured:!0},{title:"E-Commerce Storefront",description:"High-performance storefront with SSR, ISR caching, and a headless CMS.",highlights:["Achieved sub-1s LCP on product pages.","Built cart, checkout, and order tracking flows.","Integrated Algolia search and analytics."],stack:["Next.js","TypeScript","Tailwind","Stripe"],featured:!1},{title:"Internal Admin Dashboard",description:"Internal tool for managing users, billing, and support tickets with role-based views.",highlights:["Complex data tables with virtualization and filters.","Reusable form system with schema-based validation.","Reduced ticket resolution time by 35%."],stack:["React","Node.js","MongoDB","Zod","React Hook Form"],featured:!1}]},7755:(e,t,a)=>{a.d(t,{Z:()=>d});var i=a(6321);/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),n=(...e)=>e.filter((e,t,a)=>!!e&&a.indexOf(e)===t).join(" ");/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,i.forwardRef)(({color:e="currentColor",size:t=24,strokeWidth:a=2,absoluteStrokeWidth:r,className:s="",children:d,iconNode:l,...c},p)=>(0,i.createElement)("svg",{ref:p,...o,width:t,height:t,stroke:e,strokeWidth:r?24*Number(a)/Number(t):a,className:n("lucide",s),...c},[...l.map(([e,t])=>(0,i.createElement)(e,t)),...Array.isArray(d)?d:[d]])),d=(e,t)=>{let a=(0,i.forwardRef)(({className:a,...o},d)=>(0,i.createElement)(s,{ref:d,iconNode:t,className:n(`lucide-${r(e)}`,a),...o}));return a.displayName=`${e}`,a}},3884:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Boxes",[["path",{d:"M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",key:"lc1i9w"}],["path",{d:"m7 16.5-4.74-2.85",key:"1o9zyk"}],["path",{d:"m7 16.5 5-3",key:"va8pkn"}],["path",{d:"M7 16.5v5.17",key:"jnp8gn"}],["path",{d:"M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",key:"8zsnat"}],["path",{d:"m17 16.5-5-3",key:"8arw3v"}],["path",{d:"m17 16.5 4.74-2.85",key:"8rfmw"}],["path",{d:"M17 16.5v5.17",key:"k6z78m"}],["path",{d:"M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",key:"1xygjf"}],["path",{d:"M12 8 7.26 5.15",key:"1vbdud"}],["path",{d:"m12 8 4.74-2.85",key:"3rx089"}],["path",{d:"M12 13.5V8",key:"1io7kd"}]])},9925:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("ChartLine",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"m19 9-5 5-4-4-3 3",key:"2osh9i"}]])},2714:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Cloud",[["path",{d:"M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",key:"p7xjir"}]])},5980:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("CodeXml",[["path",{d:"m18 16 4-4-4-4",key:"1inbqp"}],["path",{d:"m6 8-4 4 4 4",key:"15zrgr"}],["path",{d:"m14.5 4-5 16",key:"e7oirm"}]])},7279:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]])},5220:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("GitBranch",[["line",{x1:"6",x2:"6",y1:"3",y2:"15",key:"17qcm7"}],["circle",{cx:"18",cy:"6",r:"3",key:"1h7g24"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M18 9a9 9 0 0 1-9 9",key:"n2h4wq"}]])},9182:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]])},8922:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]])},7365:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]])},5640:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("ShieldCheck",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]])},6233:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Smartphone",[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]])},3782:(e,t,a)=>{a.d(t,{Z:()=>i});/**
 * @license lucide-react v0.424.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,a(7755).Z)("Wrench",[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",key:"cbrjhi"}]])}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),i=t.X(0,[522,746],()=>a(4679));module.exports=i})();