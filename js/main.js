window.onload = () => {

  var mapM, mapR, posicion;
  var botonEliminar, botonEditar;
  // var arrayMarcadorLat = [];
  // var arrayMarcadorLng = [];

  // declaracion de variables
  let btnGetCanchas = $("#btnGetCanchas");
  let btnCrearCanchita = $("#btnCrearCancha");
  let btnCrearCanchaMain = $("#idCrearMain");
  let btnEliminarCancha = $("#btnEliminar");
  let btnModificarCancha = $("#btnModificarCancha");
  let btnBuscar = $("#btnSearch");
  let btnSubirArchivo = $("#btnSubirArchivo");
  let inputSubirArchivo = document.getElementById("inputSubirArchivo");

  let inNombre = $("#idNombre");
  let inDireccion = $("#idDireccion");
  let inTelefono = $("#idTelefono");

  datosCancha = {
    Nombre: inNombre,
    Direccion: inDireccion,
    Telefono: inTelefono,
    lat: "",
    lng: ""
  };

  let iniciarFirebase = () => {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBXlaFy_dMoEP9PGBxR-vd5DrCKJxTYVaU",
      authDomain: "dbcodigofb-33ff9.firebaseapp.com",
      databaseURL: "https://dbcodigofb-33ff9.firebaseio.com",
      projectId: "dbcodigofb-33ff9",
      storageBucket: "dbcodigofb-33ff9.appspot.com",
      messagingSenderId: "803003829082"
    };
    firebase.initializeApp(config);
  };

  let iniciarMapa = () => {
    mapM = new google.maps.Map(document.getElementById('mapa',), {
      center: {lat: -16.398764, lng: -71.536885},
      zoom: 12,
    });
  };

  let iniciarMapaR = () => {
    mapR = new google.maps.Map(document.getElementById('mapaR',), {
      center: {lat: -16.398764, lng: -71.536885},
      zoom: 12,
    });
    Listener();
  };

  let Listener = () => {
    mapR.addListener('click', evento => {
      datosCancha.lat = evento.latLng.lat();
      datosCancha.lng = evento.latLng.lng();

      colocarMarcadorR(datosCancha.lat, datosCancha.lng);
      imprimirSmall(datosCancha.lat, datosCancha.lng);
    });
  };

  let imprimirSmall = (lat, lng) => {
    let impLat = document.createElement("small");
    let impLng = document.createElement("small");

    impLat.classList = "text-muted";
    impLng.classList = "text-muted";

    let impLatLng = document.getElementById("impLatLng");

    impLat.innerHTML = `Latitud: ${lat}<br/>Longitud `;
    impLng.innerHTML = lng;

    impLatLng.appendChild(impLat);
    impLatLng.appendChild(impLng);
  };

  let colocarMarcadorR = (lat, lng) => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(() => {
        posicion = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          }, map: mapR
        });
      }, error => {
        console.error(error.message);
      });
    };
  };

  let colocarMarcadorM = (lat, lng) => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(() => {
        posicion = new google.maps.Marker({
          position: {
            lat: lat,
            lng: lng
          }, map: mapM
        });
      }, error => {
        console.error(error.message);
      });
    };
  };

  let getCanchita = () => {
    // conectarse a la base de datos
    // 1. tener una referencia al nodo al que conectaremos
    var referencia = firebase.database().ref('canchita');
    // 2. traer los datos apartir de la referencia
    // on: trae la data una vez y cuando algun cambio ocurre en la base de datos
    // la funcion "on" se vuelve a ejecutar automaticamente. Sin embargo, para que
    // el cambio suceda de forma automatica, la funcion "on" debio ser llamada por los menos 1 vez.
    // once: trae la ata una vez
    referencia.on('value', data => {
      console.log(data);
      imprimirData(data);
    });
  };

  let imprimirData = data => {
    // document.getElementById("divLista").innerHTML = "";
    let ul = document.createElement("ul");
    let div = document.getElementById("divLista");
    // let body = document.querySelector("body");
    var liKey, liNombre, liDireccion;

    data.forEach(f => {

      // arrayMarcadorLat[count] = f.val().lat;
      // arrayMarcadorLng[count] = f.val().lng;
      botonEliminar = document.createElement("button");
      botonEliminar.className = "btn btn-danger";

      botonEditar = document.createElement("button");
      botonEditar.className = "btn btn-secondary ml-2";
      botonEditar.setAttribute("data-target", "#modelIdModificar");
      botonEditar.setAttribute("data-toggle", "modal");

      // mostrando los datos de cada fila
      liKey = document.createElement("li");
      liKey.innerHTML = (`ID: <strong>${f.key}</strong>`);
      ul.appendChild(liKey);
      liNombre = document.createElement("li");
      liNombre.innerHTML = (`Nombre de la cancha: <strong>${f.val().nombre}</strong>`);
      ul.appendChild(liNombre);
      liDireccion = document.createElement("li");
      liDireccion.innerHTML = (`Direccion de la cancha: <strong>${f.val().direccion}</strong>`);
      ul.appendChild(liDireccion);
      liTelefono = document.createElement("li");
      liTelefono.innerHTML = (`Telefono de la cancha: <strong>${f.val().telefono}</strong>`);
      ul.appendChild(liTelefono);
      botonEliminar.innerHTML = "Eliminar"
      botonEditar.innerHTML = "Editar"
      liBoton = document.createElement("li");
      liBoton.appendChild(botonEliminar);
      liBoton.appendChild(botonEditar);
      ul.appendChild(liBoton);

      liNombre.style.listStyle = "none";
      liDireccion.style.listStyle = "none";
      liTelefono.style.listStyle = "none";
      liBoton.style.listStyle = "none";

      ul.appendChild(document.createElement("hr"));

      div.appendChild(ul);    
      
      colocarMarcadorM(f.val().lat, f.val().lng);

      botonEliminar.addEventListener('click', () => {
        eliminarCancha(f.key);
      });

      botonEditar.addEventListener('click', () => {
        obtenerDatos(data);
      });
    });   
    
  };

  let crearCancha = () => {
    var referencia = firebase.database().ref('canchita');

    datosCancha.Nombre = inNombre.val();
    datosCancha.Direccion = inDireccion.val();
    datosCancha.Telefono = inTelefono.val();

    // 1. generar o crear un nuevo id para el registro
    const nuevoKey = referencia.push().key;
    // 2. insertar nueva canchita
    referencia.child(nuevoKey).set({
      nombre: datosCancha.Nombre,
      direccion: datosCancha.Direccion,
      telefono: datosCancha.Telefono,
      lat: datosCancha.lat,
      lng: datosCancha.lng
    }, error => {
      if(error)
      console.error("error");
    });
  };

  let eliminarCancha = id => {
    let referencia = firebase.database().ref(`canchita/${id}`);
    referencia.remove().then(() => {
      console.log("Eliminado");
    }).catch(() => {
      console.log("Error");
    });
  };

  let obtenerDatos = data => {
    let idNombreM = $("#idNombreM");
    let idDireccionM = $("#idNombreM");
    let idTelefonoM = $("#idNombreM");

    idNombreM.val("dsadsa");
    console.log(idNombreM);
  };
  let modificarCancha = id => {
    let referencia = firebase.database().ref(`canchita/${id}`);

    

    referencia.update({
      nombre: ""

    }).then(() => {
      console.log("Modificado");
    }).catch(() => {
      console.log("Error");
    });
  };

  let buscarCancha = () => {
    let referencia = firebase.database().ref(`canchita`);
    // Falta
    referencia.orderByChild('nombre').equalTo(`$("#inputBuscar")`).on("value", data => {
      data.forEach(f => {
        console.log(`${f.nombre}`);
        console.log(`${f.direccion}`);
        console.log(`${f.telefono}`);
      });
    });
  };

  let subirArchivo = () => {
    let archivo = inputSubirArchivo.files[0];
    let nombre = archivo.name;
    let fecha = new Date;
    let nombreFinal = +(fecha) + " - " + nombre;
    let metaData;
    // referenciaa al storage de firebase
    let referenciaStorage = firebase.storage().ref();
    // if((archivo.size / 1024) > 1){
    //   console.log("Subir otro archivo");
    // }

    referenciaStorage.child(`carpeta/${nombreFinal}`).put(archivo, metaData = {
      contentType: archivo.type
    }).then(response => {
      // obtener URL de descarga de la imagen
      return response.ref.getDownloadURL();
    }).then(url => {
      console.log(url);
      let referenciaDatabase = firebase.database().ref(`canchita/-LcD8gErU38FOrNTF5y_`);
      return referenciaDatabase.update({imagen: url});
    }).then(() => {
      console.log("Foto actualizada y archivo subido")
    }).catch(error => {
      console.log(error);
    });
  };

  iniciarFirebase();

  btnBuscar.click(buscarCancha);
  btnGetCanchas.click(() => {
    getCanchita();
    iniciarMapa();
  }); 
  btnCrearCanchita.click(crearCancha);
  btnModificarCancha.click(modificarCancha);
  btnCrearCanchaMain.click(iniciarMapaR);
  // asignando el evento click al boton subir archivo
  btnSubirArchivo.click(subirArchivo);

};