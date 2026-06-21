const { chromium } = require('playwright');

const PRESETS = [
  'normal_neonato',
  'normal_lactente',
  'normal_pre_escolar',
  'normal_escolar',
  'normal_adolescente',
  'normal_adulto',
  'taquicardia_sinusal_pediatrica',
  'taquicardia_sinusal_adulto',
  'bradicardia_sinusal',
  'arritmia_sinusal_respiratoria_pediatrica',
  'artefato_movimento_leve',
  'artefato_movimento_intenso',
  'troca_eletrodos_ra_la',
];

async function testVisual() {
  console.log('\n🧪 VALIDAÇÃO VISUAL ETAPA 1\n');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('Abrindo aplicação...');
    await page.goto('http://localhost:3002', { waitUntil: 'load', timeout: 30000 });
    console.log('✅ Aplicação carregada\n');
    
    // Verificar se o select de presets existe
    await page.waitForTimeout(1000);
    const selects = await page.$$('select');
    console.log(`Encontrados ${selects.length} elementos select\n`);
    
    if (selects.length > 0) {
      // Tentar obter opções do primeiro select
      const options = await selects[0].locator('option').all();
      console.log(`Opções no dropdown: ${options.length}\n`);
      
      let found = 0;
      for (const preset of PRESETS) {
        try {
          // Tentar selecionar
          await selects[0].selectOption(preset);
          found++;
          console.log(`✅ ${preset}`);
        } catch (e) {
          console.log(`⚠️  ${preset} - não encontrado`);
        }
      }
      
      console.log(`\n📊 ${found}/${PRESETS.length} presets encontrados no dropdown`);
    }
    
  } catch (e) {
    console.error('❌ Erro:', e.message);
  } finally {
    await browser.close();
  }
}

testVisual();
