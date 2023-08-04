$(document).ready(function() {
  loadwaprov()
  loadwakabko()
  loadwakec()
  loadwtkec()

  var wa_prov = ''
  var wa_kabko = ''
  var wa_kec = ''

  // For sweetalert settings
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  // sweetalert calling
  function peringatan(judul,pesan,icon) {
    swalWithBootstrapButtons.fire({
      title: judul,
      html: pesan,
      icon: icon,
      showCancelButton: false,
      confirmButtonText: '&nbsp; OK &nbsp;',
      cancelButtonText: '',
      reverseButtons: true
    })
  }

  // load data from JSON file
  var ss = [
    {'ssname':'Anggota DPR','state':'<i class="fas"></i>'}, 
    {'ssname':'Anggota DPD','state':'<i class="fas fa-check"></i>'}, 
    {'ssname':'Pasangan calon Presiden dan Wakil Presiden','state':'<i class="fas fa-check"></i>'},
    {'ssname':'Anggota DPRD Provinsi','state':'<i class="fas fa-times"></i>'},
    {'ssname':'Anggota DPRD Kabupaten/Kota','state':'<i class="fas fa-times"></i>'}]

  
  // combobox wa-prov
  function loadwaprov(e) {
    $('#wa-prov').find('option').remove()
    $.getJSON('db_dapil.json', function(data) {
      for (var h=0; h<data.PROVINSI.length; h++) {
        let opt = document.createElement('option')
        opt.text = data.PROVINSI[h].PROVINSI
        opt.value = data.PROVINSI[h].ID
        if(e) {
          if (data.PROVINSI[h].PROVINSI == e){
            opt.selected = true
          }
        } else {
          if (data.PROVINSI[h].PROVINSI == 'Jawa Timur'){
            opt.selected = true
          }
        }
        $('#wa-prov').append(opt)
      }
    })
    $('#wa-prov').select2()
    wa_prov = '35'
  }

    // combobox wa-kabko
  function loadwakabko(e) {
    $('#wa-kabko').find('option').remove()
    $.getJSON('db_dapil.json', function(data) {
      for (var i = 0; i < data.DAPIL_JATIM.length; i++) {
        let opt = document.createElement('option')
        opt.text = data.DAPIL_JATIM[i].KABKO
        opt.value = data.DAPIL_JATIM[i].ID
        if (e) {
          if (data.DAPIL_JATIM[i].KABKO == e){
            opt.selected = true
            wa_kabko = opt.value
          }
        } else {
          if(data.DAPIL_JATIM[i].KABKO == 'Nganjuk') {
            opt.selected = true
            wa_kabko = opt.value
          }
        }
        $('#wa-kabko').append(opt)
      }
    })
    $('#wa-kabko').select2()
  }

    // combobox wa-kec dan wt-kec
  function loadwakec(e) {
    $('#wa-kec').find('option').remove()
    $.getJSON('db_dapil.json', function(data) {
      for (var j = 0; j < data.DAPIL_NGANJUK.length; j++) {
        let opt = document.createElement('option')
        opt.text = data.DAPIL_NGANJUK[j].KECAMATAN
        opt.value = data.DAPIL_NGANJUK[j].DPRDKABKO
        if(e) {
          if(data.DAPIL_NGANJUK[j].KECAMATAN == e) {
            opt.selected = true
            wa_kec = opt.value
          } else {
            wa_kec = '0'
          }
        }
        $('#wa-kec').append(opt)
      }
    })
    $('#wa-kec').select2()
  }

  function loadwtkec() {
    $('#wt-kec').find('option').remove()
    $.getJSON('db_dapil.json', function(data) {
      for (var j = 0; j < data.DAPIL_NGANJUK.length; j++) {
        let opt = document.createElement('option')
        opt.text = data.DAPIL_NGANJUK[j].KECAMATAN
        opt.value = data.DAPIL_NGANJUK[j].DPRDKABKO
        $('#wt-kec').append(opt)
      }
    })
    $('#wt-kec').select2()
  }

  $('#wa-prov').change(function() {
    wa_prov = $(this).val()
    if ($(this).val() == '35' || $(this).val() == '00') {
      loadwakabko('Nganjuk')
      loadwakec()
      $('#wa-kabko').prop('disabled', false)
      $('#wa-kec').prop('disabled', false)
    } else {
      loadwakabko('-')
      loadwakec('-')
      $('#wa-kabko').prop('disabled', true)
      $('#wa-kec').prop('disabled', true)
    }

    if($(this).val() == '00') {
      peringatan('Informasi','Untuk pemilih pindahan dari Luar Negeri, TPS Lokasi Khusus dan Pindah Domisili:<br>Isikan wilayah asal dengan alamat <strong>KTP-el/KK</strong>.','info')
    }
    wa_kabko = $('#wa-kabko').val()
    wa_kec = $('#wa-kec').val()
  })

  $('#wa-kabko').change(function() {
    wa_kabko = $(this).val()
    if ($(this).val() !== '18') {
      loadwakec("-")
      $('#wa-kec').prop('disabled', true)
    } else {
      loadwakec('')
      $('#wa-kec').prop('disabled', false)
    }
    wa_prov = $('#waprov').val()
    wa_kabko = $('#wa-kabko').val()
    wa_kec = $('#wa-kec').val()
  })

  $('#wa-kec').change(function() {
    wa_prov = $('#waprov').val()
    wa_kabko = $('#wa-kabko').val()
    wa_kec = $('#wa-kec').val()
  })

  $('#wt-kec').change(function() {
    wa_prov = $('#waprov').val()
    wa_kabko = $('#wa-kabko').val()
    wa_kec = $('#wa-kec').val()
  })

  $('#btn-cek').click(function(){
    wa_kabko = $('#wa-kabko').val()
    wa_kec = $('#wa-kec').val()
    console.log(wa_prov+' '+wa_kabko+' '+wa_kec)
    ss_default()
    if ($('#wt-kec').val()=='0') {
      // alert('Pilih Wilayah Tujuan dahulu')
      peringatan('Informasi','Pilih Wilayah Tujuan dahulu','info')
    } else if ($('#wt-kec').val() !=='0' && wa_kabko == '18' && wa_kec =='0') {
      // alert('Pilih kecamatan di wilayah asal dahulu')
      peringatan('Informasi','Pilih kecamatan di wilayah asal dahulu','info')
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
        var opstr = '<div id="op" class="table-responsive">Surat Suara yang didapat:<br><table class="table table-bordered"><tbody>'
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

  $('#bantuan').click(function(){
    peringatan('Bantuan','Isikan wilayah tujuan sesuai dengan lokasi anda sekarang. Isikan wilayah asal sesuai dengan wilayah asal pemilih yang melakukan pindah pilih. Khusus pemilih pindahan dari luar negeri atau TPS lokasi khusus silahakan pilih "Luar Negeri / Lokasi Khusus" pada isian provinsi dan sesuakan kabupaten/kota hingga kecamatan dengan dokumen KTP nya','question')
  })
});
