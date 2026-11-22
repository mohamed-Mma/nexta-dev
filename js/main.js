/* init */
$('#qf [name=u]').value=store.get('nx_u','');
$('#lg').onclick=()=>setL(L==='ar'?'en':'ar');
lib('g',$('#gl'),$('#gc'));
lib('p',$('#pl'),$('#pc'));
drawFav();runQ();drawW();drawG();drawH();setL(L);demo();
pageFromHash();
