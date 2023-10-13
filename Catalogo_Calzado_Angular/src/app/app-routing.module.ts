import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Componentes de paginas del cliente//
import { HomeComponent } from './pages/home/home.component';
import { UltimasNovedadesComponent } from './pages/Catalogo/ultimas-novedades/ultimas-novedades.component';
import { HombresComponent } from './pages/Catalogo/hombres/hombres.component';
import { MujeresComponent } from './pages/Catalogo/mujeres/mujeres.component';
import { NinosComponent } from './pages/Catalogo/ninos/ninos.component';
import { FavoritosComponent } from './components/cartas-catalogo/favoritos/favoritos.component';
import { OfertasComponent } from './pages/Catalogo/ofertas/ofertas.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { CardBuscarComponent } from './components/cartas-catalogo/cart-buscar/card-buscar.component';
import { CartCarritoComponent } from './components/cartas-catalogo/cart-carrito/cart-carrito.component';
import { CartComprobantesComponent } from './components/cartas-catalogo/cart-comprobantes/cart-comprobantes.component';
import { CartMarcasComponent } from './components/cartas-catalogo/cart-marcas/cart-marcas.component';

//componentes de formularios de Administrador//
import { FormCategoriaComponent } from './pages/admin/forms/form-categoria/form-categoria.component';
import { FormMarcaComponent } from './pages/admin/forms/form-marca/form-marca.component';
import { FormProductosComponent } from './pages/admin/forms/form-productos/form-productos.component';
import { FormInicioComponent } from './pages/admin/forms/form-inicio/form-inicio.component';
import { FormPdfComponent } from './pages/admin/forms/form-pdf/form-pdf.component';
import { FormResenasComponent } from './pages/admin/forms/form-resenas/form-resenas.component';

/////// LOGIN - REGISTER formularios /////
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { EditarusuarioComponent } from './pages/auth/editarusuario/editarusuario.component';

// Importe del Guard //
import { AuthGuard } from './guards/auth/auth.guard';
import { FormUsuariosComponent } from './pages/admin/forms/form-usuarios/form-usuarios.component';







const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'ultimas_novedades', component:UltimasNovedadesComponent},
  {path:'hombres', component:HombresComponent},
  {path:'mujeres', component:MujeresComponent},
  {path:'ninos', component:NinosComponent},
  {path:'carrito', component:CartCarritoComponent},
  {path:'comprobantes', component:CartComprobantesComponent},
  {path:'favoritos', component:FavoritosComponent},
  {path:'ofertas', component:OfertasComponent},
  {path:'about-us', component:AboutUsComponent},
  {path:'login', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'editaruser', component:EditarusuarioComponent},
  {path:'buscar', component:CardBuscarComponent},
  {path:'marcas', component:CartMarcasComponent},

  
  //Administrador//
  {path:'admin/form-inicio', component:FormInicioComponent, canActivate: [AuthGuard]},
  {path:'admin/form-categoria', component:FormCategoriaComponent, canActivate: [AuthGuard]},
  {path:'admin/form-marca', component:FormMarcaComponent, canActivate: [AuthGuard]},
  {path:'admin/form-productos', component:FormProductosComponent, canActivate: [AuthGuard]},
  {path:'admin/form-usuarios', component:FormUsuariosComponent, canActivate: [AuthGuard]},
  {path:'admin/form-pdf', component:FormPdfComponent, canActivate: [AuthGuard]},
  {path:'admin/form-resenas', component:FormResenasComponent, canActivate: [AuthGuard]},
  {path:'**',pathMatch:'full',redirectTo:'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }

