/* eslint-disable jsx-a11y/anchor-is-valid */
import logo from '../../publicResources/logoMabis.svg';
import { ShoppingCart } from '../cartPage/ShoppingCart';
import { CgProfile } from 'react-icons/cg' 
import { useMemo, useRef, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../../firebase-config';
import { useEffect } from 'react';
import { useContext } from 'react';
import { FirebaseAuthContext } from '../../../FirebaseAuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ShoppingCartMobile } from '../cartPage/ShoppingCartMobile';
import Image from 'next/image';

import RO from '../../publicResources/ro.svg'
import IT from '../../publicResources/it.svg'
import DE from '../../publicResources/de.svg'
import GB from '../../publicResources/gb.svg'
import FR from '../../publicResources/fr.svg'
import { AiOutlineArrowDown } from 'react-icons/ai';
import { BsArrowDownShort, BsBoxArrowInDown, BsSearch } from 'react-icons/bs';
import { collection, getDocs } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';

export default function Header() {

  const router = useRouter()
  const { id } = router.query

  const { user, conditional } = useContext(FirebaseAuthContext)

  const [language, setLanguage] = useState("GB");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [user, conditional]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
  }, []);
  
  const logOut = async () => {
    await signOut(auth)

    window.location.reload()
  }
 
  function LogInOrOut() {
    if (user?.uid){
      return (
        <div className='headerLogin'>
      <div className='headerLoginIcons'>
        <Link href="/profile"> <CgProfile /> </Link>
        </div>

        <div className='headerLoginText'>
        <p>
        {language === "RO" ? 'Salut' :
        language === "IT" ? "Ciao" :
        language === "DE" ? "Hallo" :
        language === "FR" ? "Salut" :
        "Hi"}, {conditional.firstName}
          
          </p> 
          <button className='logoutButtonHeader' onClick={logOut}>{
          language === "RO" ? 'Delogheaza-te' 
        : language === "IT" ? "Disconnettersi"
        : language === "DE" ? 'Ausloggen'
        : language === "FR" ? 'Se déconnecter' 
        : 'Log Out'} </button>
      </div>

        </div>
      )
    } else {
      return (
        <button className='loginButtonHeader'><Link href="/login">{language === "RO" ? 'Conecteaza-te' :
        language === "IT" ? 'Accedi' :
        language === "DE" ? 'Anmelden' :
        language === "FR" ? 'Connexion' :
        'Log in'}</Link></button>
      )
    }
  }

  function LogInOrOutMobile(){
    if(user?.uid){
      return(
        <button className='logoutButtonHamburger' onClick={logOut}>{
          language === "RO" ? 'Delogheaza-te' 
        : language === "IT" ? "Disconnettersi"
        : language === "DE" ? 'Ausloggen'
        : language === "FR" ? 'Se déconnecter' 
        : 'Log Out'}</button>
      ) 
    } else {
      return(
        <button className='logoutButtonHamburger'><Link href="/login"> {language === "RO" ? 'Conectează-te' :
        language === "IT" ? 'Accedi' :
        language === "DE" ? 'Anmelden' :
        language === "FR" ? 'Connexion' :
        'Log in'}
         </Link></button>
      )
      }
    }


  const activeClass = ({isActive}) => isActive ? "activeClassNav" : {};

  const activeClassHamburger = ({isActiveHamburger}) => isActiveHamburger ? "activeClassHamburger" : "link";

  useEffect(() => {
      const checkbox = document.querySelector('#navi-toggle');
      const body = document.querySelector('body');

      const handleCheckboxClick = () => {
        if (checkbox.checked) {
          body.classList.add('no-scroll');
        } else {
          body.classList.remove('no-scroll');
        }
      };

      const handleNavLinkClick = () => {
        body.classList.remove('no-scroll');
      };

      checkbox.addEventListener('click', handleCheckboxClick);
      document.querySelectorAll('.item a').forEach(link => {
        link.addEventListener('click', handleNavLinkClick);
      });

      return () => {
        checkbox.removeEventListener('click', handleCheckboxClick);
        document.querySelectorAll('.item a').forEach(link => {
          link.removeEventListener('click', handleNavLinkClick);
        });
      };
  }, []);

  
    const [selectedFlag, setSelectedFlag] = useState('');
  
    const handleChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedFlag(selectedValue);
      localStorage.setItem('language', selectedValue);
    };

    const [open, setOpen] = useState(false)

    const handleOpen = () => {
      setOpen(!open)
    }

    const flagComponents = {
      RO: <Image src={RO} alt='ro' width={26}/>,
      IT: <Image src={IT} alt='it' width={26}/>,
      GB: <Image src={GB} alt='gb' width={26} />,
      DE: <Image src={DE} alt='de' width={26} />,
      FR: <Image src={FR} alt='fr' width={26} />
    };
    
    const handleLanguageChange = (country) => {
      localStorage.setItem('language', country)
      window.location.reload()
    }

    const [dropdown, setDropdown] = useState(false)

    function handleDropdown (){
      setDropdown(!dropdown)
    }

    function handleMouseLeave(event) {
      const dropdownElement = document.querySelector('.dropdown');
    
      if (dropdownElement && !dropdownElement.contains(event.target)) {
        setDropdown(false);
      }
    }
    
      const [searchQuery, setSearchQuery] = useState("");
      const [products, setProducts] = useState([])
      const [searchLoading, setSearchLoading] = useState(true);
      const [searchSearchLoading, setSearchSearcLoading] = useState(true)

      useEffect(() => {
        const ref = collection(db, "products");
    
        const getProducts = async () => {
          setSearchLoading(true);
          const data = await getDocs(ref);
          setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          setLoading(false);
          setSearchSearcLoading(false);
        };
    
        getProducts();
      }, []);

      const filteredProducts = useMemo(() => {
        const filtered = products.filter((obj) =>
          obj.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
        const sorted = filtered.sort((a, b) => {
          const [productNameA, kgA] = a.title.split(" - ");
          const [productNameB, kgB] = b.title.split(" - ");
      
          const nameComparison = productNameA.localeCompare(productNameB);

          if (nameComparison === 0) {
            const kgComparison = parseInt(kgA) - parseInt(kgB);
            return kgComparison;
          }
      
          return nameComparison;
        });
      
        return sorted;
      }, [products, searchQuery]);

  const searchFilterMapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchFilterMapRef.current &&
        !searchFilterMapRef.current.contains(event.target)
      ) {
        setSearchQuery('');
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  console.log(products)

  return (
    <>
    <div className='flexWrapper'>
    

    <section id="home" className='flex'>
      <div className='logo'>
        <Image src={logo} className='logo' alt="logo" width={250}/>

        {/* <Image src={logo} className='logoMobile' alt="logoMobile" width={250} height={250}/> */}
      </div>

    <div className='desktopAnchors'>
      <div className='nav_anchors'>
        <Link href='/' className={router.pathname === '/' ? 'activeClassNav' : ''}>
          {
          language === "RO" ? 'Acasa' :
          language === "IT" ? 'Home' :
          language === "DE" ? 'Zuhause' :
          language === "FR" ? "Accueil" : 
          'Home'}
          
        </Link>
        
        <div id="dropdown-div" onMouseEnter={handleDropdown} onMouseLeave={handleDropdown} onClick={handleDropdown}>
            <p id="dropdown-link" className={router.pathname === '/peleti' || router.pathname === '/rumegus' || router.pathname === '/brichete' || router.pathname === '/tocatura' ? 'activeClassNav linkLink' : 'linkLink'}>{language === "RO" ? 'Produse' :
            language === "IT" ? 'Informazioni' :
            language === "DE" ? 'Über' :
            language === "FR" ? 'À propos' :
            'Products'} <BsArrowDownShort />
          </p>

          {dropdown && 
          <div className='dropdown'>
            <div className='dropdownFlex'>
              <Link href='/peleti'>Peleti</Link>
              <Link href='/rumegus'>Rumegus</Link>
              <Link href='/brichete'>Brichete Rumegus</Link>
              <Link href='/tocatura'>Tocatura Lemn</Link> 
            </div>
          </div>
          }
        </div>

        <Link className={router.pathname === '/servicii' ? 'activeClassNav' : ''} href='/servicii'>
        {language === "RO" ? 'Servicii' :
          language === "IT" ? 'Recensioni' :
          language === "DE" ? 'Bewertungen' :
          language === 'FR' ? 'Commentaires' :
          'Services'}
        </Link>
        
        <Link className={router.pathname === '/reviews' ? 'activeClassNav' : ''} href='/reviews'>
        {language === "RO" ? 'Recenzii' :
          language === "IT" ? 'Recensioni' :
          language === "DE" ? 'Bewertungen' :
          language === 'FR' ? 'Commentaires' :
          'Reviews'}
        </Link>
        
        <Link className={router.pathname === '/blog' ? 'activeClassNav' : ''} href='/blog'>
          Blog
        </Link>
        

        <Link className={router.pathname === '/contact' ? 'activeClassNav' : ''} href='/contact'>
        {language === "RO" || "FR" ? 'Contact' :
          language === "IT" ? 'Contatto' :
          language === "DE" ? 'Kontakt' :
          'Contact'}
        </Link>

        {conditional && conditional.admin  && (
          <Link className={router.pathname === '/panel' ? 'activeClassNav' : ''} href='/panel'>
            {language === "RO" ? 'Panou' :
            language === "IT" ? 'Pannello' :
            language === "DE" ? 'Panel' :
            language === 'FR' ? 'Panneau' :
            'Panel'}
          </Link>
        )}        
        </div>
    </div>

    <div className='desktopCart'> 
      <ShoppingCart/>
    </div>
      
      <LogInOrOut />

    <div className='mobileCart'>
        <ShoppingCartMobile/>  
      </div>

      <div onClick={handleOpen} className='languageSelector'>
        {flagComponents[language]}
      {open && (
        <div className='languageList'>
          <a onClick={() => handleLanguageChange('RO')}><Image src={RO} alt='ro' width={30}/></a>
          {/* <a onClick={() => handleLanguageChange('IT')}><Image src={IT} width={30} alt='it'/></a> */}
          <a onClick={() => handleLanguageChange('GB')}>
            <Image src={GB} width={30} alt='gb' />
          </a>
          {/* <a onClick={() => handleLanguageChange('DE')}>
            <Image src={DE} alt='de' width={30} />
            </a> */}
          {/* <a onClick={() => handleLanguageChange('FR')}>
            <Image src={FR} alt='fr' width={30} />
          </a> */}
        </div>
      )}
      </div>

    <div className='hamburger'>
        <input type="checkbox" id="navi-toggle" className="checkbox" />
        <label htmlFor="navi-toggle" className="button">
          <span className="icon">&nbsp;</span>
        </label>
      <div className="background">&nbsp;</div>

      <nav className="nav">
        <ul className="list">

          <li className="item"> <Link className={router.pathname === '/' ? 'activeClassNav' : ''} href='/'>
          {
          language === "RO" ? 'Acasa' :
          language === "IT" ? 'Home' :
          language === "DE" ? 'Zuhause' :
          language === "FR" ? "Accueil" :
          'Home'}</Link> </li>

          <li className="item"> <Link className={router.pathname === '/about' ? 'activeClassNav' : ''} href='/about'>{language === "RO" ? 'Produse' :
          language === "IT" ? 'Prodotti' :
          language === "DE" ? 'Produkte' :
          language === "FR" ? 'Des produits' :
          'Produse'}</Link> </li>


          {/* <li className="item">
            <Link href='/peleti' className={router.pathname === '/peleti' ? 'activeClassNav' : ''}>Produse
            </Link>
          </li> */}

          <li className="item"> <Link className={router.pathname === '/reviews' ? 'activeClassNav' : ''} href='/reviews'>{language === "RO" ? 'Recenzii' :
          language === "IT" ? 'Recensioni' :
          language === "DE" ? 'Bewertungen' :
          language === 'FR' ? 'Commentaires' :
          'Reviews'}</Link> </li>

          <li className="item"> <Link className={router.pathname === '/contact' ? 'activeClassNav' : ''} href='/contact'>{language === "RO" || "FR" ? 'Contact' :
          language === "IT" ? 'Contatto' :
          language === "DE" ? 'Kontakt' :
          'Contact'}</Link> </li>
          
          {conditional && conditional.admin === true && (
            <li className='item'><Link className={router.pathname === '/panel' ? 'activeClassNav' : ''} href='/panel'>{language === "RO" ? 'Panou' :
            language === "IT" ? 'Pannello' :
            language === "DE" ? 'Panel' :
            language === 'FR' ? 'Panneau' :
            'Panel'}</Link> </li>
            )}

          {user?.uid && (
            <li className='item'> <Link className={router.pathname === '/profile' ? 'activeClassNav' : ''} href='/profile'>
              {language === "RO" ? `Profilul lui ${conditional.firstName}` :
              language === "IT" ? `Profilo di ${conditional.firstName}` :
              language === "DE" ? `${conditional.firstName}'s Profil` :
              language === 'FR' ? `Profil d'${conditional.firstName}` :
              `${conditional.firstName}'s Profile`}
              </Link> </li>
          )}
     
          <LogInOrOutMobile/>
        </ul>
      </nav>
</div>  
          
  </section>
      <div className='searchWrapper'>
        <input type='text' placeholder='Ce produs cumperi astazi? :)' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} id={searchQuery.length > 0 ? 'searchWrapperSearch' : ''} />
        
        <div className='iconWrapper'>
        <BsSearch  />
        </div>
      </div>
      
      <AnimatePresence>
  {searchQuery.length > 0 && (
    <motion.div
      className="searchFilterMap"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.3 }}
      ref={searchFilterMapRef}
    >
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => {
          const regex = new RegExp(searchQuery, 'gi');
          const highlightedTitle = product.title.replace(
            regex,
            '<span style="color: red;">$&</span>'
          );

          return (
            <div className="gridItem" key={product.id}>
              <div className="gridItem__flex">
                <p dangerouslySetInnerHTML={{ __html: highlightedTitle }}></p>
                <Image src={product.image} width={100} height={100} alt="pozaProdus" />
                <p>
                  {product.kg} <span>KG</span>
                </p>
                <p>
                  {product.price} <span>{product.currency}</span>
                </p>
                <Link href={`products/${product.id}`}>{language === 'RO' ? 'Vezi Produsul' : 'See product'}</Link>
              </div>
            </div>
          );
        })
      ) : (
        <p>No items were found.</p>
      )}
    </motion.div>
  )}
</AnimatePresence>



  </div>
  </>
  );
}
