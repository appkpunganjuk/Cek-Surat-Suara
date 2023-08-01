$(document).ready(function() {
  // load data from JSON file
  var ss = [
    {'ssname':'Anggota DPR','state':'<i class="fas"></i>'}, 
    {'ssname':'Anggota DPD','state':'<i class="fas fa-check"></i>'}, 
    {'ssname':'Pasangan calon Presiden dan Wakil Presiden','state':'<i class="fas fa-check"></i>'},
    {'ssname':'Anggota DPRD Provinsi','state':'<i class="fas fa-times"></i>'},
    {'ssname':'Anggota DPRD Kabupaten/Kota','state':'<i class="fas fa-times"></i>'}]

  $.getJSON('db_dapil.json', function (data) {
    console.log(data.DAPIL_NGANJUK) 
    // combobox wa-kabko
    for (var i = 0; i < data.DAPIL_JATIM.length; i++) {
      let opt = document.createElement('option')
      opt.text = titleCase(data.DAPIL_JATIM[i].KABKO)
      opt.value = data.DAPIL_JATIM[i].ID
      $('#wa-kabko').append(opt)
    }

    for (var j = 0; j < data.DAPIL_NGANJUK.length; j++) {
      let opt = document.createElement('option')
      opt.text = titleCase(data.DAPIL_NGANJUK[j].KECAMATAN)
      opt.value = data.DAPIL_NGANJUK[j].DPRDKABKO
      $('#wt-kec').append(opt)
    }

  });

  $('#wa-kabko').change(function() {
    if ($('#wa-kabko').val() !== '18') {
      $('#wa-kec-div').hide()
    } else {
      $('#wa-kec-div').show()

      $.getJSON('db_dapil.json', function (data) {
        for (var i = 0; i <= data.DAPIL_NGANJUK.length; i++) {
          let opt = document.createElement('option')
          opt.text = titleCase(data.DAPIL_NGANJUK[i].KECAMATAN)
          opt.value = data.DAPIL_NGANJUK[i].DPRDKABKO
          $('#wa-kec').append(opt)
        }
      })
    }
  })

  $('#btn-cek').click(function(){
    ss_default()
    $.getJSON('db_dapil.json', function (data) {
      // compare dapil jatim
      for(var i=0; i<data.DAPIL_JATIM.length;i++){
        if(data.DAPIL_JATIM[i].ID == $('#wa-kabko').val()) {
          if(data.DAPIL_JATIM[i].DPRRI == "8" && data.DAPIL_JATIM[i].DPRDJATIM == "11"){
            ss[0].state = '<i class="fas fa-check"></i>'
            ss[3].state = '<i class="fas fa-check"></i>'
          } else if(data.DAPIL_JATIM[i].DPRRI == "8" && data.DAPIL_JATIM[i].DPRDJATIM !== "11") {
            ss[0].state = '<i class="fas fa-check"></i>'
          }
          console.log(data.DAPIL_JATIM[i])
        }
      }
      // compare dapil nganjuk
      if($('#wa-kec').val() == $('#wt-kec').val()) {
        ss[4].state = '<i class="fas fa-check"></i>'
      }
      // create the output
      var opstr = '<div id="op">Surat Suara yang didapat:<br><table border="0">'
      for(var x = 0; x < ss.length; x++) {
        opstr += '<tr>'
        opstr += '<td style="padding-right: 12px">' + ss[x].ssname + '</td><td class="text-center" style="border:1px solid rgb(28,98,139); padding-left:4px; padding-right:4px">'+ ss[x].state + '</td>'
        opstr += '</tr>'
        console.log(ss[x])
      }
      opstr+= '</table></div>'
      if($('#op')) {
        $('#op').remove()
      }
      $('#res-box').append(opstr)
    })
    
  })

  function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
    }
    return str.join(' ');
  }

  function ss_default() {
    ss[0].state='<i class="fas fa-times"></i>'
    ss[3].state='<i class="fas fa-times"></i>'
    ss[4].state='<i class="fas fa-times"></i>'
  }

});