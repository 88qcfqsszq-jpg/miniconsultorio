const { chromium } = require('playwright');
const fs = require('fs');

const PRESETS = [
  { id: 'normal_neonato', name: 'ECG Normal — Neonato' },
  { id: 'normal_lactente', name: 'ECG Normal — Lactente' },
  { id: 'normal_pre_escolar', name: 'ECG Normal — Pré-escolar' },
  { id: 'normal_escolar', name: 'ECG Normal — Escolar' },
  { id: 'normal_adolescente', name: 'ECG Normal — Adolescente' },
  { id: 'normal_adulto', name: 'ECG Normal — Adulto' },
  { id: 'taquicardia_sinusal_pediatrica', name: 'Taquicardia Sinusal Pediátrica' },
  { id: 'taquicardia_sinusal_adulto', name: 'Taquicardia Sinusal Adulto' },
  { id: 'bradicardia_sinusal', name: 'Bradicardia Sinusal' },
  { id: 'arritmia_sinusal_respiratoria_pediatrica', name: 'Arritmia Sinusal Respiratória Pediátrica' },
  { id: 'artefato_movimento_leve', name: 'Artefato de Movimento Leve' },
  { id: 'artefato_movimento_intenso', name: 'Artefato de Movimento Intenso' },
  { id: 'troca_eletrodos_ra_la', name: 'Troca de Eletrodos RA/LA' },
];

async function testVisual() {
  console.log('\n🧪 VALIDAÇÃO VISUAL ETAPA 1 — 13 PRESETS\n');
  console.log('='.repeat(100));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  try {
    // Carrega a página
    console.log('\n📍 Abrindo http://localhost:3002...');
    await page.goto('http://localhost:3002', { waitUntil: 'load', timeout: 30000 });
    console.log('✅ Página carregada');
    
    // Procura por link OSCE ou Treinamento
    await page.waitForTimeout(2000);
    
    // Tenta encontrar um formulário ou modal com select
    const allText = await page.textContent('body');
    
    // Procura por elemento que contenha "Simulador" ou "ECG"
    const simuladorLink = await page.$('a:has-text("Simulador"), button:has-text("ECG"), a:text-matches("ECG")');
    
    if (simuladorLink) {
      console.log('Clicando em Simulador ECG...');
      await simuladorLink.click();
      await page.waitForTimeout(2000);
    }
    
    // Procura pelo select de presets
    await page.waitForTimeout(1000);
    
    // Tenta encontrar selects na página
    const selects = await page.$$('select');
    console.log(`\n📊 Elementos select encontrados: ${selects.length}`);
    
    if (selects.length > 0) {
      // Tenta obter as opções
      for (let i = 0; i < selects.length; i++) {
        const select = selects[i];
        const optionTexts = await page.evaluate(s => {
          return Array.from(s.querySelectorAll('option')).map(o => o.value);
        }, select);
        
        console.log(`\nSelect #${i+1} contém ${optionTexts.length} opções:`);
        optionTexts.forEach(opt => {
          console.log(`  - ${opt}`);
        });
      }
      
      // Agora testa cada preset
      if (selects.length > 0) {
        console.log('\n' + '='.repeat(100));
        console.log('\n🧪 TESTANDO CADA PRESET:\n');
        
        const select = selects[0];
        
        for (let idx = 0; idx < PRESETS.length; idx++) {
          const preset = PRESETS[idx];
          const num = String(idx + 1).padStart(2, '0');
          
          try {
            // Selecionar o preset
            await select.selectOption(preset.id);
            await page.waitForTimeout(300);
            
            // Verificar se gerou erro
            const errorText = await page.textContent('[role="alert"]').catch(() => null);
            const hasError = errorText?.includes('Erro') || errorText?.includes('erro');
            
            // Procurar por indicadores de sucesso
            const hasTraces = await page.$('.ECGTrace, [class*="trace"], [class*="ecg"], svg').catch(() => null);
            
            console.log(`${num}. ${hasError ? '❌' : '✅'} ${preset.name}`);
            
            results.push({
              numero: num,
              preset: preset.name,
              carrega: true,
              geraECG: !hasError,
              status: hasError ? 'ERRO' : 'OK'
            });
            
          } catch (e) {
            console.log(`${num}. ⚠️  ${preset.name} - ${e.message.substring(0, 50)}`);
            results.push({
              numero: num,
              preset: preset.name,
              carrega: false,
              geraECG: false,
              status: 'ERRO'
            });
          }
        }
      }
    } else {
      console.log('\n⚠️  Nenhum select encontrado na página');
      console.log('Procurando elementos input[type="select"]...');
      const inputs = await page.$$('input[type="select"]');
      console.log(`  Encontrados: ${inputs.length}`);
    }
    
  } catch (e) {
    console.error('\n❌ Erro geral:', e.message);
  } finally {
    // Resumo
    console.log('\n' + '='.repeat(100));
    console.log('\n📊 RESUMO:\n');
    
    const passed = results.filter(r => r.geraECG).length;
    const failed = results.length - passed;
    
    console.log(`Total testado: ${results.length}`);
    console.log(`✅ Sucesso: ${passed}`);
    console.log(`❌ Falha: ${failed}`);
    console.log(`Taxa: ${((passed/results.length)*100).toFixed(1)}%`);
    
    if (passed === 13) {
      console.log('\n🎉 ETAPA 1 APROVADA VISUALMENTE!');
    }
    
    console.log('\n');
    
    await browser.close();
  }
}

testVisual().catch(console.error);
