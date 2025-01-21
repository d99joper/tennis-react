import React from "react"
import './layout.css'
import ResponsiveMenu from "./Menu/responsiveMenu"

function Header(props) {

  // const location = useLocation()
  // const pathnames = location.pathname.split('/').filter((x) => x)

  if(props.show === false) return
  return (
    <>
      <ResponsiveMenu {...props} />

      {/* <Breadcrumbs className='breadcrumbs'>
        {pathnames.map((elem, index) => {
          console.log(elem)
          return (
            <Typography key={`${elem}_${index}`}>{elem}</Typography>
          )
        })}
      </Breadcrumbs> */}
    </>
  );
}
export default Header;