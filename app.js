$(document).ready(function() {

  $('#wa-kabko').select2()
  $('#wa-kec').select2()
  $('#wt-kec').select2()
  $('#wa-prov').select2()

  var wa_prov = ''
  var wa_kabko = ''
  var wa_kec = ''
  // load data from JSON file
  var ss = [
    {'ssname':'Anggota DPR','state':'<i class="fas"></i>'}, 
    {'ssname':'Anggota DPD','state':'<i class="fas fa-check"></i>'}, 
    {'ssname':'Pasangan calon Presiden dan Wakil Presiden','state':'<i class="fas fa-check"></i>'},
    {'ssname':'Anggota DPRD Provinsi','state':'<i class="fas fa-times"></i>'},
    {'ssname':'Anggota DPRD Kabupaten/Kota','state':'<i class="fas fa-times"></i>'}]

  $.getJSON('db_dapil.json', function (data) {
    console.log(data.PROVINSI)
    // combobox wa-prov
    for (var h=0; h<data.PROVINSI.length; h++) {
      let opt = document.createElement('option')
      opt.text = data.PROVINSI[h].PROVINSI
      if (data.PROVINSI[h].PROVINSI == "Jawa Timur"){
        opt.selected = true
      }
      $('#wa-prov').append(opt)
    }
    wa_prov = $('#wa-prov').val()

    // combobox wa-kabko
    for (var i = 0; i < data.DAPIL_JATIM.length; i++) {
      let opt = document.createElement('option')
      opt.text = data.DAPIL_JATIM[i].KABKO
      opt.value = data.DAPIL_JATIM[i].ID
      $('#wa-kabko').append(opt)
    }
    wa_kabko = $('#wa-kabko').val()

    // combobox wa-kec dan wt-kec
    for (var j = 0; j < data.DAPIL_NGANJUK.length; j++) {
      let opt = document.createElement('option')
      opt.text = data.DAPIL_NGANJUK[j].KECAMATAN
      opt.value = data.DAPIL_NGANJUK[j].DPRDKABKO
      let opt2 = document.createElement('option')
      opt2.text = opt.text
      opt2.value = opt.value
      $('#wt-kec').append(opt)
      $('#wa-kec').append(opt2)
    }
    wa_kec = $('#wa-kec').val()
  });

  $('#wa-prov').change(function() {
    wa_prov = $(this).val()
    if ($(this).val() == 'Jawa Timur' || $(this).val() == 'Luar Negeri') {
      $('#wa-kabko').prop('disabled', false)
      $('#wa-kec').prop('disabled', false)
      wa_kabko = $('#wa-kabko').val()
      wa_kec = $('#wa-kec').val()
    } else {
      $('#wa-kabko').prop('disabled', true)
      $('#wa-kec').prop('disabled', true)
      wa_kabko = ''
      wa_kec = ''
    }
  })

  $('#wa-kabko').change(function() {
    wa_kabko = $(this).val()
    if ($(this).val() !== '18') {
      $('#wa-kec').prop('disabled', true)
      wa_kec = ''
    } else {
      $('#wa-kec').prop('disabled', false)
      wa_kec = $('#wa-kec').val()
    }
  })

  $('#wa-kec').change(function() {
    wa_kec = $(this).val()
  })

  $('#btn-cek').click(function(){
    ss_default()
    if ($('#wt-kec').val()=='') {
      alert('Pilih Wilayah Tujuan dahulu')
    } else if ($('#wt-kec').val() !=='' && wa_kabko == '18' && wa_kec =='') {
      alert('Pilih kecamatan di wilayah asal dahulu')
    } else {
      $.getJSON('db_dapil.json', function (data) {
        // compare dapil jatim
        for(var i=0; i<data.DAPIL_JATIM.length;i++){
          if(data.DAPIL_JATIM[i].ID == wa_kabko) {
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
        if(wa_kec == $('#wt-kec').val()) {
          ss[4].state = '<i class="fas fa-check"></i>'
        }
        // create the output
        var opstr = '<div id="op" class="table-responsive"><table class="table table-bordered"><tbody>'
        for(var x = 0; x < ss.length; x++) {
          if(ss[x].state == '<i class="fas fa-times"></i>') {
            opstr += '<tr><td style="text-decoration:line-through">' + ss[x].ssname + '</td><td class="text-center bg-warning text-light">'+ ss[x].state + '</td></tr>'
          } else {
            opstr += '<tr><td>' + ss[x].ssname + '</td><td class="text-center">'+ ss[x].state + '</td></tr>'
          }
          console.log(ss[x])
        }
        opstr+= '</tbody></table></div>'
        if($('#op')) {
          $('#op').remove()
        }
        $('#res-box').append('Surat Suara yang didapat:<br>')
        $('#res-box').append(opstr)
        location.href = '#end-page'
      })
    }
  })

  function ss_default() {
    ss[0].state='<i class="fas fa-times"></i>'
    ss[3].state='<i class="fas fa-times"></i>'
    ss[4].state='<i class="fas fa-times"></i>'
  }

});
