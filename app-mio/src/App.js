import React, { useState, useEffect } from 'react';
import Buscador from './components/Buscador';
import ListadoImagenes from './components/ListadoImagenes';
import Error from './components/Error';
import Spinner from './components/Spinner';

function App() {

  const [ busqueda, guardarBusqueda] = useState('');
  const [ imagenes, guardarImagenes ] = useState([]);
  const [ paginaActual, guardarPaginaActual ] = useState(1);
  const [ totalPaginas, guardarTotalPaginas ] = useState(1);
  const [error, guardarError] = useState(false);
  const [cargando, guardarCargando] = useState(false);


  useEffect(() => {

      const consultarApi = async () => {

          if(busqueda === '') return;

          const imagenesPorPagina = 30;
        const key = '13313345-0de39d7c67d32f60ad7416258';

          const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaActual}`;

          const respuesta = await fetch(url);
          const resultado = await respuesta.json();

        guardarCargando(true);
        console.log(resultado.totalHits)
        
        if (resultado.totalHits == 0){
            console.log('se va a mostrar el error')
            guardarError(true)
            return;
          }
          guardarError(false)

          // ocultar spinner y agregar el resultado
        setTimeout(() => {
          guardarCargando(false);
          guardarImagenes(resultado.hits);
        }, 3000);



          // Calcular el total de paginas
          const calcularTotalPaginas = Math.ceil( resultado.totalHits / imagenesPorPagina)
          guardarTotalPaginas( calcularTotalPaginas );

          // Mover la pantalla hacia la parte superior
          const jumbotron = document.querySelector('.jumbotron');
          jumbotron.scrollIntoView({behavior : 'smooth', block: 'end'});
      }
      consultarApi();

  }, [busqueda, paginaActual]);

  const paginaAnterior = () => {
    let nuevaPaginaActual = paginaActual - 1;

    // colocarlo en el state
    guardarPaginaActual(nuevaPaginaActual);

  }
  const paginaSiguiente = () => {
    let nuevaPaginaActual = paginaActual + 1;
    
    // colocamos en el state
    guardarPaginaActual(nuevaPaginaActual);
  }
  const componente = (cargando) ? <Spinner /> : <ListadoImagenes imagenes={imagenes}/>

  return (
    <div className="app container">
        <div className="jumbotron">
            <p className="lead text-center">Buscador de Imágenes</p>

            <Buscador 
              guardarBusqueda={guardarBusqueda}
            />
        {(error) ? <Error mensaje="No se encontro ninguna imagen" /> : null}
        </div>
        {componente}

        <div className="row justify-content-center">
              

              { ( paginaActual === 1 ) ? null : (
                  <button onClick={paginaAnterior} type="button" className="btn btn-info mr-1">Anterior &laquo;</button>
              ) }
              
              { (paginaActual === totalPaginas ) ? null : (
                  <button onClick={paginaSiguiente} type="button" className="btn btn-info">Siguiente &raquo;</button>
              )}
              
        </div>
    </div>
  );
}

export default App;
