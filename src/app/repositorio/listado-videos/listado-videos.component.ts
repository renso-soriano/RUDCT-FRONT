import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RepositorioVideoService } from 'app/shared/services/mantenimientos/repositoriovideo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router} from '@angular/router';
import * as alertFunctions from "../../../app/shared/data/sweet-alerts";
import { AuthService } from "app/shared/services/core/auth.service";
import { GrupoUsuario } from 'app/shared/models/grupoUsuario.enum';


@Component({
  selector: 'app-listado-videos',
  templateUrl: './listado-videos.component.html',
  styleUrls: ['./listado-videos.component.scss']
})

export class ListadoVideosComponent implements OnInit {
  Id: number[];
  typeEdit: boolean;
  notFound: boolean;
  mostrarBoton: boolean = true;

  public rows
  constructor(
    private repositorioVideoService: RepositorioVideoService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService:AuthService
  ) { }
  limitSelected: any = 10;

  page = {
    limit: this.limitSelected,
    count: 0,
    offset: 0
  }

  public videoslist: SafeResourceUrl[] = [];
  public nombrevideo:string[] = []
  mode: string;
  isAdmin = false;
  role = GrupoUsuario;

  ngOnInit(): void {
    this.mode = this.typeEdit ? "Editar" : "Registrar nuevo";
    let grupousuario = this.authService.getGrupos().map(a => a.groupId);
    this.mostrarBoton = grupousuario.includes(3022);
    console.log(this.mostrarBoton);
  }

  async pageCallback(pageInfo: { count?: number; pageSize?: number; limit?: number; offset?: number; }) {
    // Asegúrate de asignar correctamente el offset proporcionado por el evento pageChange
    this.llamarVideos(pageInfo); // Llama a llamarDocumentos para actualizar los datos

  }

  onPageChange(pageInfo: { count?: number; pageSize?: number; limit?: number; offset?: number; }) {
    console.log(pageInfo,'eta no ete si'); // Verifica si el objeto pageInfo contiene el valor correcto de offset
    this.pageCallback(pageInfo); // Llama a pageCallback con el objeto pageInfo
  }

  llamarVideos(pageinfo?) {
    this.repositorioVideoService.getRepositorioVideo(pageinfo,this.limitSelected).subscribe((data:any) => {
      this.page.count = data.total;
      this.rows = []
      this.rows = data.items;
      this.Id = [];
      this.nombrevideo = [];
      this.videoslist = [];
      this.rows.forEach(item =>{
        this.nombrevideo.push(item.nombre)
        this.Id.push(item.id)
        this.videoslist.push(this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.extractVideoId(item.enlace)}`
        ))

      })

      console.log('lo dato',this.videoslist)
    });
    //   data => {
    //     this.videoslist = data.map(a => this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.extractVideoId(a.enlace)));
    //     this.nombrevideo = data.map(a =>a.nombre );
    //     this.Id = data.map(a =>a.id );
    //   },
    //   error => {
    //     console.error('Error al obtener los documentos del repositorio:', error);
    //   }

  }

  redirectToRepositorio(): void {
    this.router.navigate(['/repositorio']);
  }
  redirectToSave(): void {
    this.router.navigate(['/repositorio/Createvideos/']);
  }


  extractVideoId(url: string): string {
    let videoId: string = '';

    // Caso 1: URL del tipo https://youtu.be/CbuRuZ5U4Y8?si=dQX3TEHn2me-NvQD
    const shortUrlMatch = url.match(/youtu\.be\/([^\?]+)/);
    if (shortUrlMatch && shortUrlMatch.length > 1) {
        videoId = shortUrlMatch[1];
    }

    // Caso 2: URL del tipo https://www.youtube.com/watch?v=CbuRuZ5U4Y8
    const longUrlMatch = url.match(/[?&]v=([^&]+)/);
    if (!videoId && longUrlMatch && longUrlMatch.length > 1) {
        videoId = longUrlMatch[1];
    }

    return videoId;
}

  editar(Id: string) {
    this.router.navigate(["/repositorio/EditVideo/",Id]);
  }
  eliminar(id: string) {
    alertFunctions.EliminarRegistro("/repositorio/listadovideo",this.repositorioVideoService.deleteRepositorioVideo(id));
  }


}
