import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',timeout:90000,use:{baseURL:'http://localhost:5173',headless:true,launchOptions:{executablePath:'/usr/bin/chromium',args:['--no-sandbox','--enable-unsafe-swiftshader']}}});
