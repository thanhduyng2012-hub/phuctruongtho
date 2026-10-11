import {test,expect} from '@playwright/test';
test('3D editor, dimensions, viewpoints and saved layout',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await expect(page.locator('#area')).toContainText('72.0');
 await page.getByRole('spinbutton',{name:'Chiều ngang',exact:true}).fill('7');await expect(page.locator('#area')).toContainText('84.0');
 await page.locator('[data-view="inside"]').click();await expect(page.locator('#view-label')).toHaveText('03 / TRONG QUÁN');
 await page.locator('#objects button').filter({hasText:'Quầy bếp'}).click();await expect(page.locator('#object-badge')).toHaveText('PHƯƠNG ÁN ĐỀ XUẤT');
 await page.locator('#object-fields').getByRole('spinbutton',{name:'Chiều dài',exact:true}).fill('4.2');
 await page.locator('#add-table').click();await expect(page.locator('#objects button')).toHaveCount(9);await page.locator('#delete').click();await expect(page.locator('#objects button')).toHaveCount(8);
 await page.locator('#move').click();await expect(page.locator('#move')).toHaveClass('active');await page.locator('#move').click();
 const downloadPromise=page.waitForEvent('download');await page.locator('#export').click();const download=await downloadPromise;const path=await download.path();await page.locator('#file').setInputFiles(path);await expect(page.locator('#toast')).toContainText('Đã nhập');
 await page.reload();await expect(page.getByRole('spinbutton',{name:'Chiều ngang',exact:true})).toHaveValue('7.00');
 await page.locator('[data-view="overview"]').click();await page.screenshot({path:'/tmp/ptt-desktop.png',fullPage:true});expect(errors).toEqual([]);
 const pixels=await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2');const p=new Uint8Array(4);gl.readPixels(c.width/2,c.height/2,1,1,gl.RGBA,gl.UNSIGNED_BYTE,p);return Array.from(p)});expect(pixels[3]).toBe(255);
});
test('mobile layout and invalid import',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('canvas')).toBeVisible();await page.locator('#file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":2}')});await expect(page.locator('#toast')).toContainText('Không thể nhập');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);await page.screenshot({path:'/tmp/ptt-mobile.png',fullPage:true})});
