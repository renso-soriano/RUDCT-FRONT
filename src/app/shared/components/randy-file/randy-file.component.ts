// import { IDropDown } from '@/shared/interfaces/IDropDown';
// import { ModalComponent } from '@/shared/components/element/modal/modal.component';

import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
// import { DropdownService } from '@/shared/services/dropdown.service';
import { environment } from 'environments/environment';

import { Observable, Subject, Subscription } from 'rxjs';
// import { TipoDocumento } from '@/shared/enum/tipo-documento.enum';
// import { RandyFileService } from '@/shared/services/randy-file/randy-file.service';
// import { FileException } from '@/shared/enum/file-exception.enum';
// import Archivo from '@/shared/interface/randy-file/archivo.interface';
// import { FileEntityType } from '@/shared/enum/file-entity-type.enum';

// import { IResponse } from '@/shared/interface/response.interface';
// import { HttpClientService } from '@/shared/core/http-client/http-client.service';
import { map, filter } from 'rxjs/operators';
import Archivo from 'app/demandas/interface/archivo.interface';
import { RandyFileService } from 'app/shared/services/randy-file/randy-file.service';
import { HttpClient } from '@angular/common/http';
import { FileException } from 'app/shared/enum/file-Exception.enum';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'Randy-File',
  templateUrl: './randy-file.component.html',
  styleUrls: ['./randy-file.component.scss'],
})
export class RandyFileComponent implements OnInit, OnDestroy, OnChanges {



  sub$: Subject<boolean> = new Subject<boolean>()
  // @Input() fileEntityType: FileEntityType
  @Input() isDetail: boolean;
  @Input() name: string = ''
  @Input() disabled = false
  @Input() listaDemanda: Archivo[];
  // @Input() modalRef: ModalComponent //referencia del modal
  // @Input() documentTypeExplicit: TipoDocumento //Tipo de documento
  @Input() route: string //Terminal de la ruta EJEMPLO: "Negociacion | Seguimiento | Iniciativa"
  @Output() fileCountChange = new EventEmitter<number>()
  @Output() deleteFileExisting = new EventEmitter<any>()
  @Output() fileChangeType = new EventEmitter<any>()
  @Output() onSubmit = new EventEmitter<Observable<any>>()


  @Input() withModal: boolean = false
  //#region Config
  fileLimit: number = environment.appMaxFileCount;
  fileType: Array<string> = environment.allowedFileTypes
  maxFileSize: number = environment.appMaxFileSize
  mimeType: Array<string> = environment.allowedMimeTypes
  multiple: boolean = false
  //#endregion
  UPLOAD_URL: string = "File/UploadFileList/"

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
    console.log("Noel a verfg", value);
    if (value?.length > 0) {
      console.log(value, "KLK ANEXOS");

      this._anexoDataDb = value
      this.selected = value
      this.update()
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes['anexoDataDb']){

    //     this._anexoDataDb = changes['anexoDataDb'].currentValue
    //     this.selected = changes['anexoDataDb'].currentValue
    //     this.update();
    // }
    console.log(changes, "QUE TA PASANDO CON ESTOS INPUTS");
  }

  constructor(private toastr: ToastrService,
    private randyFileService: RandyFileService,
    private http: HttpClient,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    console.log("Ramdy File Init");

    this.multiple = this.fileLimit > 1
    this.uploader = new FileUploader({
      isHTML5: true,
      allowedMimeType: this.mimeType,
      allowedFileType: this.fileType,
      queueLimit: this.fileLimit,
      maxFileSize: this.maxFileSize * (Math.pow(1024, 2)),
    })

    this.uploader.onWhenAddingFileFailed = (fileItem, { name }) => {
      console.log(fileItem, "Demo ");
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
      else {
        // console.log("add", this.uploader.queue);
        this.addedFileToQueue()

      }
    }
    this.uploader.onAfterAddingFile = () => {
      // console.log("AQUI");
      this.addedFileToQueue()
    }

  }


  get getCount() {
    return this.selected.length
  }

  update() {
    this.emitFileCount()
  }

  getFiles(): Archivo[] {
    const files = this.selected.filter(x => !x.id)
    // console.log(files, "FILES");
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
    this.dropdownFileType();
    console.log("Estoy en el on INit klk");
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
  addedFileToQueue() {
    const files = this.uploader.queue.map(file => file?._file)
    this.selected.push({ file: files[files.length - 1], tipoDocumentoId: 1 })
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
      console.log("Lista de Ids", this.listaIds);
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


