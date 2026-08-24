let franceData=null, mondeData=null, chart=null;

async function init(){
  const [f,m] = await Promise.all([fetch('data/france.json').then(r=>r.json()), fetch('data/monde.json').then(r=>r.json())]);
  franceData=f; mondeData=m;

  const selFr=document.getElementById('selFr');
  const selMonde=document.getElementById('selMonde');
  if(!selFr || !selMonde) return;

  selFr.innerHTML = f.elus.map(e=> `<option value="${e.id}">${e.label} — ${e.net_mensuel_estime? e.net_mensuel_estime.toLocaleString('fr-FR')+'€ net' : 'bénévole'} (${e.categorie})</option>`).join('');
  selMonde.innerHTML = m.pays.map(p=> `<option value="${p.code}">${p.pays} — ${p.mandat} (${p.brut_mensuel_eur.toLocaleString('fr-FR')}€)</option>`).join('');

  // defaults
  selFr.value='depute';
  selMonde.value='DE';

  document.getElementById('btnCompare').addEventListener('click', compare);
  compare();
}

function compare(){
  const idFr = document.getElementById('selFr').value;
  const codeMonde = document.getElementById('selMonde').value;
  const fr = franceData.elus.find(e=>e.id===idFr);
  const etr = mondeData.pays.find(p=>p.code===codeMonde);
  if(!fr || !etr) return;

  const frNet = fr.net_mensuel_estime || 0;
  const frBrut = fr.brut_mensuel || 0;
  const frMedian = 1940;
  const frRatio = frNet ? (frNet/frMedian).toFixed(1) : '—';

  // table
  const rows = [
    ['Mandat', `<strong>${fr.label}</strong><br><span class="small">${fr.categorie}</span>`, `<strong>${etr.mandat}</strong><br><span class="small">${etr.pays}</span>`],
    ['Rémunération perçue', `<strong>${frNet? frNet.toLocaleString('fr-FR')+' € net / mois' : '0 € (bénévole)'} </strong><br><span class="small">Brut ${frBrut.toLocaleString('fr-FR')}€</span>`, `<strong>${etr.brut_mensuel_eur.toLocaleString('fr-FR')} € / mois</strong><br><span class="small">PPA ${etr.ppa_eur.toLocaleString('fr-FR')}€</span>`],
    ['En × salaire médian local', `<span class="badge">${frRatio}×</span><br><span class="small">médian FR 1 940€ net</span>`, `<span class="badge">${etr.ratio_median}×</span><br><span class="small">médian ${etr.pays} ${etr.salaire_median_pays_eur.toLocaleString('fr-FR')}€</span>`],
    ['Enveloppe staff / frais', `<span class="small">${fr.enveloppe_collaborateurs? fr.enveloppe_collaborateurs.toLocaleString('fr-FR')+'€ staff' : '—'}<br>${fr.frais_mandat? (typeof fr.frais_mandat==='number'? fr.frais_mandat.toLocaleString('fr-FR')+'€ AFM' : fr.frais_mandat) : ''}</span>`, `<span class="small">${etr.avantages}</span>`],
    ['Avantages', `<span class="small">${fr.avantages}</span>`, `<span class="small">${etr.avantages}</span>`],
  ];
  const tbl = document.getElementById('resultTable');
  tbl.innerHTML = `<thead><tr><th></th><th>🇫🇷 France</th><th>🌍 ${etr.pays}</th></tr></thead><tbody>` + rows.map(r=> `<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('') + `</tbody>`;

  // insight
  const diffEur = etr.brut_mensuel_eur - frNet;
  const diffPct = frNet? Math.round((etr.brut_mensuel_eur/frNet*100)-100) : 0;
  const ratioDiff = etr.ratio_median - parseFloat(frRatio||0);
  let insight='';
  if(frNet===0){
    insight = `Mandat bénévole en France vs ${etr.brut_mensuel_eur.toLocaleString('fr-FR')}€ à l'étranger. La comparaison en × médian n'a pas de sens ici : le conseiller municipal français n'est pas rémunéré.`;
  } else if(diffEur>0){
    insight = `En €, l'élu étranger gagne <strong>${diffEur.toLocaleString('fr-FR')}€ de plus</strong> (+${diffPct}%). Mais en privilège relatif, il est à <strong>${etr.ratio_median}× le médian</strong> contre <strong>${frRatio}×</strong> pour le Français. ${ratioDiff>0? `Il est donc <strong>${ratioDiff.toFixed(1)}× plus privilégié</strong> dans son pays.` : `Il est <strong>${Math.abs(ratioDiff).toFixed(1)}× moins privilégié</strong> malgré un montant supérieur.`}`;
  } else {
    insight = `En €, le Français gagne <strong>${Math.abs(diffEur).toLocaleString('fr-FR')}€ de plus</strong> (${Math.abs(diffPct)}% de plus). En privilège relatif : <strong>${frRatio}×</strong> (FR) vs <strong>${etr.ratio_median}×</strong> (${etr.pays}).`;
  }
  document.getElementById('insight').innerHTML = insight;
  document.getElementById('result').style.display='grid';

  // chart
  const ctx=document.getElementById('chart');
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type:'bar',
    data:{
      labels:['En € / mois', 'En × médian local'],
      datasets:[
        {label: fr.label, data:[frNet, parseFloat(frRatio)||0], backgroundColor:'#0f3b5e', borderRadius:6},
        {label: etr.pays+' '+etr.mandat, data:[etr.brut_mensuel_eur, etr.ratio_median], backgroundColor:'#d97706', borderRadius:6}
      ]
    },
    options:{
      responsive:true,
      plugins:{legend:{position:'bottom'}, title:{display:true, text:'Comparaison à méthode constante'}},
      scales:{y:{beginAtZero:true}}
    }
  });
}

init();
