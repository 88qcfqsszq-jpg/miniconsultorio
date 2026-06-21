const { chromium } = require('playwright');

async function testRitmoFix() {
  console.log('\n🧪 TESTE DE CORREÇÃO: Linha II Ritmo sem fundo preto\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navegar para aplicação
    console.log('📍 Abrindo http://localhost:3002...');
    await page.goto('http://localhost:3002', { waitUntil: 'load', timeout: 30000 });
    
    // Aguardar UI carregar
    await page.waitForTimeout(2000);
    
    // Procurar por elemento SVG com fundo (que seria a linha ritmo)
    const svgs = await page.$$('svg');
    console.log(`\n✅ Página carregada (${svgs.length} elementos SVG encontrados)`);
    
    // Verificar cores de background em SVGs
    console.log('\n📊 Verificando cores de fundo em SVGs:\n');
    
    let foundBlackBg = false;
    let foundRoseBg = false;
    
    for (let i = 0; i < Math.min(svgs.length, 20); i++) {
      const bgColor = await svgs[i].evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.backgroundColor;
      });
      
      if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
        if (bgColor.includes('rgb(0, 0, 0)') || bgColor === 'black' || bgColor.includes('000')) {
          console.log(`   SVG ${i}: ❌ PRETO (${bgColor})`);
          foundBlackBg = true;
        } else if (bgColor.includes('254') && bgColor.includes('245')) {
          console.log(`   SVG ${i}: ✅ ROSADO CLARO (${bgColor})`);
          foundRoseBg = true;
        }
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📋 RESULTADO:\n');
    
    if (foundBlackBg) {
      console.log('❌ FALHOU: Ainda existe SVG com fundo preto!');
    } else if (foundRoseBg) {
      console.log('✅ PASSOU: Nenhum SVG com fundo preto detectado!');
      console.log('✅ SVG com fundo rosado claro foi encontrado!');
    } else {
      console.log('⚠️  Resultado inconclusivo (não encontrou SVGs com cores específicas)');
    }
    
    console.log('\n');
    
  } catch (e) {
    console.error('❌ Erro:', e.message);
  } finally {
    await browser.close();
  }
}

testRitmoFix().catch(console.error);
