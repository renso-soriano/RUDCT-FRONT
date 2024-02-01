import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import Archivo from 'app/demandas/interface/archivo.interface';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';
import { HttpClient } from '@angular/common/http';
import { FileException } from 'app/shared/enum/file-Exception.enum';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
import { APIResponse } from 'app/shared/models/Core/api-response.interface';
import { HttpClientService } from 'app/shared/core/http-client/http-client.service';
import { ModalComponent } from '../modal/modal.component';
import { SweetAlertService } from '../sweet-alert/sweet-alert.service';
import { AuthService } from 'app/shared/services/core/auth.service';
import { DropDownServiceService } from 'app/shared/services/drop-down-service.service';
import emailUtils from 'app/shared/utilidades/email-utils';
import { EmailService } from 'app/shared/services/email.service';
import { SSOInstitucionService } from 'app/shared/services/mantenimientos/ssoInstituciones.services';
import { SSOService } from 'app/shared/services/sso.service';
import { Demanda } from 'app/shared/models/Demandas/Demanda.model';
import { DemandasService } from 'app/shared/services/mantenimientos/demandas.service';

@Component({
  selector: 'Randy-File',
  templateUrl: './randy-file.component.html',
  styleUrls: ['./randy-file.component.scss'],
})
export class RandyFileComponent implements OnInit, OnDestroy {



  sub$: Subject<boolean> = new Subject<boolean>()
  // @Input() fileEntityType: FileEntityType
  @Input() isDetail: boolean;
  @Input() isGobiernoAbierto: boolean = false;
  @Input() name: string = ''
  @Input() disabled = false
  @Input() listaDemanda: Archivo[];
  @Input() modalRef: ModalComponent
  @Input() estadoAnexo: boolean
  estadoObservable = new BehaviorSubject(false);
  // @Input() modalRef: ModalComponent //referencia del modal
  // @Input() documentTypeExplicit: TipoDocumento //Tipo de documento
  @Input() route: string //Terminal de la ruta EJEMPLO: "Negociacion | Seguimiento | Iniciativa"
  @Output() fileCountChange = new EventEmitter<number>()
  @Output() deleteFileExisting = new EventEmitter<any>()
  @Output() fileChangeType = new EventEmitter<any>()
  @Output() onSubmit = new EventEmitter<Observable<any>>()
  demanda: Demanda;


  @Input() withModal: boolean = false
  @Input() validarevidencia:boolean = false
  //#region Config
  fileLimit: number = environment.appMaxFileCount;
  fileType: Array<string> = environment.allowedFileTypes
  maxFileSize: number = environment.appMaxFileSize
  mimeType: Array<string> = environment.allowedMimeTypes
  multiple: boolean = false
  //#endregion
  UPLOAD_URL: string = "File/UploadFileList/"
  Validar_URL: String = environment.apiUrl + "DemandaAnexo"
  URL: string = environment.apiUrl;

  datostransformados: number[];
  selected: Archivo[] = []
  loading: boolean = false
  uploader: FileUploader
  hasBaseDropZoneOver = false
  tipoDocumentos: Observable<any>;
  archivo: any;
  pruebaa: any;
  listaIds: any;
  deletedFielsQueue = [];
  hiddenDownLoad = true;
  _anexoDataDb: any
  documentUrl: any;
  @Input('anexoDataDb') set anexoDataDb(value: any[]) {
    if (value?.length > 0) {
      this._anexoDataDb = value
      this.selected = value
      this.update()
    }

  }

  institucionUsuarioSSO: number;
  nombreInstitucionUsuarioEnRUDT: any;
  idInstitucionUsuarioEnRUDT: any;
  constructor(private toastr: ToastrService,
    private randyFileService: RandyFileService,
    private http: HttpClient,
    private http_noel: HttpClientService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private _sas: SweetAlertService,
    private authService :AuthService,
    private dropDownService:DropDownServiceService,
    private emailservice:EmailService,
    private ssoservice:SSOService,
    private ssoinstitucionService:SSOInstitucionService,
    private demandasService: DemandasService,
  ) {
    // console.log("Ramdy File Init");

    this.multiple = this.fileLimit > 1
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedMimeType: this.mimeType,
      allowedFileType: this.fileType,
      queueLimit: this.fileLimit,
      maxFileSize: this.maxFileSize * (Math.pow(1024, 2)),

    })
    // console.log(this.uploader);

    this.uploader.onWhenAddingFileFailed = (fileItem, { name }) => {
      // console.log(fileItem, "Demo ");
      // console.log(name, "NAME");
      if (name === FileException.MimeType) {
        // console.log(name, "mimeType");
        this.toastr.warning(`Los formatos permitidos son: ${this.fileType.map(value => " " + value)} `, 'Formato de archivo')
      }

      else if (name === FileException.QueueLimit) {
        this.toastr.warning('Solo se permiten 10 archivos en la carga de anexos.', 'Limite de archivos')

      }

      else if (name === FileException.FileSize) {
        this.toastr.warning('El tamaño máximo por archivo es de 5MB.', 'Tamaño de archivo')

      }
      else if (name === FileException.FileType) {
        this.toastr.warning(`Los tipos de archivos permitidos son: ${this.fileType.map(value => " " + value)}  .`, 'Tamaño de archivo')

        // this.addedFileToQueue(fileItem)

      }
      else {

      }
    }
    this.uploader.onAfterAddingFile = (item: FileItem) => {
      // console.log(item, "AQUI");
      this.addedFileToQueue(item._file)
    }

    // this.uploader.onSuccessItem = (item) => {
    //   console.log(item, "SUCCESS");
    // }

  }

  validarDocumento(id: Archivo) {
    const idFrom = id;
    let modifyStatus = [{ from: 'DemandaAnexo', op: "replace", path: "estadoAnexo", value: true }];
    console.log(this.selected.map(a=> a.institucionId))
    if (idFrom.estadoAnexo == false) {
      this._sas.AlertConfirm('Validación evidencias', 'Esta seguro que desea validar la evidencia?', 'question')
        .then((a) => {
          if (a.valueOf() == true) {
            this.http_noel.patch<APIResponse<any[]>>(modifyStatus, `demandaAnexo/${idFrom.id}`).subscribe( res => {
              if(res.statusCode == 200){
              this._sas.success('Documento Marcado Como valido Correctamente');
                let index = this.selected.find(x => x.id === idFrom.id);
                index.estadoAnexo = true
                this.ssoinstitucionService.getSSOInstitucionIds(this.selected.map(a=> a.institucionId))
                 .pipe(
                    switchMap(data => {
                        this.datostransformados = data
                        return this.ssoservice.GetPersonByInstitutionId(this.datostransformados,1003)
                    })
                 ).subscribe(data=> {
                  this.emailservice.createEmail({
                    ToEmail: data.result.map(a=>a.email),
                    Subject:'Evidencia demanda realizada',
                    Body: `La institucion DGES le ha validado su evidencia para una de las demandas asignadas `,
                    Attachments: []
                }).subscribe(
                (response) => {
                  console.log('Correo enviado con éxito:', response);
                },
                 (error) => {
                  console.error('Error al enviar el correo:', error);
                }
                  )
                 }
                 )
               
                //TODO -> en vez de cerrar que actualize  la data que presenta
              }
            })
          }

        })

      }
    }


    // setTimeout(() => {
    //   window.location.reload();
    // }, 2000);
    // window.location.reload();



  get getCount() {
    return this.selected.length
  }

  update() {
    this.emitFileCount()
  }

  getFiles(): Archivo[] {
    const files = this.selected.filter(x => !x.id)
    console.log("Noel files", files);
    return files;

  }
  async openDocument(item) {

    await this.randyFileService.downloadFile(item.file.id).toPromise().then((res: any) => {
      console.log(res);
      this.receiveBase64Document(res.base64, res.file.type);


    })


    if (this.documentUrl) {
      window.open(this.documentUrl.changingThisBreaksApplicationSecurity);
    }
  }
  private receiveBase64Document(base64: string, contentType: string) {
    // const contentType = 'application/pdf'; // Reemplaza por el tipo de contenido adecuado

    // Crea la URL segura a partir del base64
    const binaryData = atob(base64);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uintArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uintArray[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([uintArray], { type: contentType });
    this.documentUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));
  }



  ngOnInit() {
    this.institucionUsuarioSSO = this.authService?.getInstitucion();

    this.dropdownFileType();


    this.dropDownService
      ?.getInstitucionById(this.institucionUsuarioSSO)
      .subscribe((x: any) => {
        this.nombreInstitucionUsuarioEnRUDT = x[0]["name"];
        this.idInstitucionUsuarioEnRUDT = x[0]["id"];

      });
  }

  getFileList() {
    // await this.http.get<Observable<any>>(`${this.URL}DemandaAnexo/GetDocumentByDemandaId/${demandaId}`).toPromise()
    // .then((res: any) => {
    //   this.mapFiles(res)
    //   console.log("Noel files GEEEET: ", res);
    // })
  }

  dropdownFileType() {
    this.tipoDocumentos = this.randyFileService.getFileType();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e
  }

  handleFile(element: HTMLElement): void {
    element.click()
  }
  addedFileToQueue(file) {
    console.log(this.uploader.queue, "QUEUE");
    // const files = this.uploader.queue.map(file => file?._file)
    // console.log(files, "FILEs");
    // this.selected.push({ file: files[files.length - 1], tipoDocumentoId: 1 })
    this.selected.push({ file, tipoDocumentoId: null, estadoAnexo: false,
       institucionNombre:this.nombreInstitucionUsuarioEnRUDT, institucionId:this.idInstitucionUsuarioEnRUDT  })
    console.log(this.selected, "Files");
    this.emitFileCount()

  }
  changeType(doc, tipoDocumentoId) {
    if (doc?.id > 0) {
      this.fileChangeType.emit(doc)

    }
    console.log(doc, "DOCUMENTO");
    console.log(tipoDocumentoId, "DIPO DOCUMENTO ID");

  }
  private emitFileCount() {
    this.fileCountChange.emit(this.selected.length)
  }

  // FIXME:Implementar eliminar
  removeFileFromQueue(item, index: number) {
    let fileDeleted = this.selected.splice(index, 1)

    if (item?.id) {
      this.deleteFileExisting.emit(item.id)
    }
    console.log(item, "BORRANDO");
    this.emitFileCount()
  }


  getAnexos() {
    this.randyFileService.uploadFiles(this.listaIds).subscribe(res => {
      res = this.listaIds;
      console.log("Lista de Ids Nooooooel", this.listaIds);
    })
  }

  downLoadFile(item) {
    // console.log(item, "ITEM");
    // return
    this.randyFileService.downloadFile(item.file.id).subscribe((res: any) => {
      console.log(res, "DOWNLOAD");
      this.archivo = res;
      saveAs(this.archivo.file, this.archivo.nombreArchivo)

    })
  }

  close() {
    const files = this.selected.filter(x => !x.id)
    if (files.length > 0) {
      const data = this.randyFileService.createFormData(files);
      const obs = this.randyFileService.uploadFiles(data);
      this.onSubmit.emit(obs)
    }
    this.getAnexos()
    // this.modalRef.closethis()
  }

  ngOnDestroy(): void {
    console.log("SE DESTRUYE");
    this.sub$.next(true)
    this.sub$.unsubscribe()
    // this.fileService.clearService()

  }
}


