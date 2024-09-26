import Link from 'next/link'
import { strings } from 'src/resources/locales/i18n'
import Routing from 'src/routing'
import AsyncImage from 'ui/image/AsyncImage'
import { LoginForm } from 'components/form/LoginForm'
import { setLoginState } from 'src/login/LoginActions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { HeaderTwo } from 'components/HeaderTwo'
import { apiGetProductsHome } from 'src/admin/products/ProductActions'
import { useDispatch, useSelector } from 'src/redux/hooks'

export default function LoginPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeProp, setFadeProp] = useState({ fade: 'fade-in' });
 
  const { productsHome, loadingProduct } = useSelector(({ ProductReducer }) => {
    const { productsHome, loadingProduct, count } = ProductReducer
    // , page, count, limit

    return { productsHome, loadingProduct, count }
  })

  useEffect(() => {
     dispatch(apiGetProductsHome())
    return () => { }
  }, [])


  const images = [
    '/images/products.jpg',
    '/images/product.1.jpg',
    '/images/product.2.jpg',
    '/images/product.3.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Cambiar el fade antes de cambiar la imagen
      setFadeProp({ fade: 'fade-out' });

      // Después de 500ms cambiar la imagen y restaurar el fade-in
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeProp({ fade: 'fade-in' });
      }, 300); // Tiempo que dura el efecto de fade-out
    }, 5000); // Cambia cada 3 segundos
    
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const currentUrl = window.location.href;

    const isForgotPassword = currentUrl.includes('forgotPassword=true');

    if (isForgotPassword) {
      dispatch(setLoginState({ prop: 'hps', value: false }))
    }
  }, []);

  return (
    <>
      <HeaderTwo />

      <div className='container-fluid p-0 position-relative'>
        <img
          src={images[currentImageIndex]}
          alt='Products'
          className={`img-fluid ${fadeProp.fade}`}
          style={{ width: '100%', height: '400px', objectFit: 'cover',  transition: 'opacity 0.5s ease-in-out'}}
        />
        <div style={{ width: '100%', height: '400px'}} className='position-absolute bg-dark-opacity top-50 start-50 translate-middle text-center text-white p-3 bg-opacity-75'>
          <h1 className='display-4 text-white mt-20'>¿Quiénes Somos?</h1>
          <h4 className='text-white mt-4'>Somos más que una empresa; somos un movimiento hacia un estilo de vida más saludable y sostenible. Fundada con la misión de promover el bienestar integral de las personas y el cuidado de nuestro planeta, nos dedicamos a comercializar productos naturales que enriquecen la vida diaria y fomentan una conexión más profunda con la naturaleza.</h4>
        </div>
      </div>


      <div className='container-fluid bg-pr'>

        <div className='justify-content-center d-flex'>
          <div style={{ maxWidth: '480px', width: '100%' }}>
            <div className='mb-8 mt-13'>
              <h1 className='ls-tight font-bolder h2 mb-3 text-center'>
                {strings('button.login')}
              </h1>
            </div>

            <LoginForm />

            <div className='text-center border-top pt-5 mb-10'>
              <small>{strings('ask.haventGotAccount')}</small>
              <a
                onClick={() => {
                  router.push(Routing.registerEmail)
                }}
                className='text-sm font-semibold cursor-pointer'> {strings('button.register')}</a>
            </div>

          </div>

        </div>


        <br />
        <br />
        <div className="container mt-18">


        
        <div className="row">
        {!loadingProduct && productsHome.map((product, index) =>
                  <div className="col-md-4 mb-5" key={index}>
                        <div className="card product-card">
                          <img src={product.img} className="card-img-top product-image" alt="Product Image" />
                          <div className="card-body">
                            <h5 className="card-title">{product.name}</h5>
                            <p className="card-text">Precio: ${product.price}</p>
                            <p className="card-text">{product.description}</p> 
                            </div>
                        </div>
                      </div>
                   
          )}
           </div>

          <br />


          <div className="row mt-5">
            {/* Acordeón 1 */}
            <div className="col-md-6 mb-4">
              <div className="accordion" id="accordionOne">
                <div className="accordion-item">
                  <h2 className="accordion-header bg-f4e4c2" id="headingOne">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      <strong>NUESTRA VUELTA A LO NATURAL</strong>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionOne"
                  >
                    <div className="accordion-body bg-white">
                    Hasta los actuales momentos, hemos vivido en un mundo que se encuentra manipulado y controlado en muchos aspectos importantes de nuestras vidas, uno de ellos es la alimentación.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header bg-f4e4c2" id="headingTwo">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionOne"
                  >
                    <div className="accordion-body bg-white">
                    La industrialización, la televisión y los medios de comunicación, la tecnología, entre otros, han influenciado al colectivo a cambiar los hábitos de una alimentación natural, donde se dedicaba un tiempo adecuado a la preparación de los alimentos, con ingredientes muchas veces cultivados en sus propios huertos, a una alimentación basada en productos industrializados y derivados del petróleo, de rápida preparación y con altos contenidos de azúcar y sal, pero que lamentablemente deja de lado el valor nutricional de los mismos ya que, en muchos casos, estos productos están compuestos por ingredientes que son nocivos para la salud y su uso prolongado produce desequilibrios de vitaminas, minerales y nutrientes que ocasionan enfermedades, en algunos casos crónicas como el cáncer, diabetes, hipertensión, Alzheimer, artritis, tan solo por mencionar algunas de las más comunes y que esclavizan a gran parte de la población a invertir grandes sumas de dinero en costosos tratamientos farmacológicos que muchas veces producen efectos secundarios que desmejoran considerablemente la vida de quienes los consumen.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header bg-f4e4c2" id="headingThree">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionOne"
                  >
                    <div className="accordion-body bg-white">
                    Otro aspecto vital, al que muchas veces no se le da la gran importancia que tiene, es el consumo de agua. 
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Acordeón 2 */}
            <div className="col-md-6 mb-4">
              <div className="accordion" id="accordionTwo">
                <div className="accordion-item">
                  <h2 className="accordion-header bg-f4e4c2" id="headingFour">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="true"
                      aria-controls="collapseFour"
                    >
                      <strong>LA IMPORTANCIA DEL AGUA</strong>
                      </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse show"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionTwo"
                  >
                    <div className="accordion-body bg-white bg-white">
                    Lamentablemente un alto porcentaje de las personas no tienen el hábito del consumo diario adecuado de agua, ignorando los beneficios que esta aporta al cuerpo. Dentro de estos beneficios podemos mencionar 10 de los principales:
                      <ul>
                      <li>Alivia la fatiga</li>
                      <li>Evita el dolor de cabeza y las migrañas</li>
                      <li> Ayuda en la digestión y evita el estreñimiento</li>
                      <li> Ayuda a mantener la belleza de la piel</li>
                      <li> Reduce el riesgo de cáncer</li>
                      </ul>

                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header bg-f4e4c2" id="headingFive">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFive"
                      aria-expanded="false"
                      aria-controls="collapseFive"
                    >
                    </button>
                  </h2>
                  <div
                    id="collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFive"
                    data-bs-parent="#accordionTwo"
                  >
                    <div className="accordion-body bg-white">
                    Existe una fórmula para poder calcular la cantidad de agua adecuada que cada persona debería consumir durante el día. Dividiendo el peso en kgs de la persona entre 7 obtenemos el número de vasos de agua de 250 cc que la persona debería consumir durante el día. Para obtener la cantidad de agua expresada en litros, multiplicamos el número de vasos de agua que obtuvimos en la fórmula por 250.
                    <br></br>
                    No. vasos de agua 250 cc  =      Peso de la persona (kgs)
                        _________
                          7
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header bg-f4e4c2" id="headingSix">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseSix"
                      aria-expanded="false"
                      aria-controls="collapseSix"
                    >
                    </button>
                  </h2>
                  <div
                    id="collapseSix"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingSix"
                    data-bs-parent="#accordionTwo"
                  >
                    <div className="accordion-body bg-white">
                    Nuestro planeta Tierra está evolucionando, hay evidencia científica de que cada día aumenta su frecuencia vibratoria (Frecuencia Schumann), esto, aunado a  las circunstancias actuales que vivimos en el mundo, están haciendo que muchas personas aumenten su frecuencia vibratoria y despierten a un nuevo estado de conciencia, lo que las está llevando a buscar nuevas formas de vida, de mayor conexión espiritual con el universo y buscando estilos de vida basados en alimentación más natural, consumiendo menos productos industrializados, ejercitando el cuerpo y aportándole lo que necesita para tener una vida plena, de vitalidad, enérgica y saludable.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br />

          <br />

        </div>
      </div>

      <nav className="navbar fixed-bottom navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Copyright © 2024 Eco Healthy Internacional </a>
        </div>
      </nav>

    </>
  )
}
