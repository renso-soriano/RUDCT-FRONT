// email-utils.ts

import { Iemail } from "app/shared/models/Iemail";
import { EmailService } from "app/shared/services/email.service";
import {GrupoUsuario} from "app/shared/models/grupoUsuario.enum";
import { SSOService } from "../services/sso.service";
import { SSOInstitucionService } from "../services/mantenimientos/ssoInstituciones.services";
import { switchMap } from "rxjs/operators";



export class emailUtils {
    constructor(
        
        private emailService: EmailService,
        private ssoService: SSOService,
        private ssoInstitucion:SSOInstitucionService
        ) {
            console.log('entré al email utils');
            
        }

    public async constructEmail(
        demandaDescripcion?: string,
        accionesresult?: string,
        gruposUsuario?: number,
        hayComentarios?: boolean,
        estadocambio?: boolean,
        institucion?: string,
        estadonuevo?: string,
        EstadosValidacion?:string,
        listadoInstituciones?:any[],
        sesubioevidencia?: boolean,
        seleasignounademanda?:boolean
    ): Promise<Iemail | null> {
 
        let data: Iemail = null;
        let subject: string;
        let body: string;
        let emails: string[];
        let institucio = true
        let datostransformados:number[] 
        
         this.ssoInstitucion.getSSOInstitucionIds(listadoInstituciones).subscribe(
            data =>{
                return data
            }
        )
        switch (gruposUsuario) {
            case GrupoUsuario.regionalesRUDT:
                
                    if(EstadosValidacion == 'Registrada por ORP'){
                        subject = 'Nueva demanda registrada'
                        body = `Se ha registrado una nueva demanda, la demanda ${demandaDescripcion}`
                        this.ssoService.getPersonByGroupId(3021,1003).subscribe(data => {
                            emails = data.result.map(a=>a.email)
                            this.notifyClientByEmail({
                                ToEmail: emails,
                                Subject: subject,
                                Body: body,
                                Attachments: []
                            })
                         });
                    }
                    
                break;

                case GrupoUsuario.VIOTDR:
                    if(EstadosValidacion == 'Validada por VIOTDR'){
                        subject = hayComentarios && EstadosValidacion ? 'nuevos comentarios registrados y estado cambiados' :
                        hayComentarios ? 'Nuevo comentario registrado' :
                        estadocambio ? 'Estado cambiado' : 'Se ha hecho una modificación en la demanda';
                     body = hayComentarios && estadocambio ?
                    `La institucion VIOTDR ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                     hayComentarios ?
                    `La institucion VIOTDR ha realizado nuevos comentarios a la demanda ${demandaDescripcion}` :
                    estadocambio ?
                    `La institucion VIOTDR ha cambiado el estado de validacion en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                   `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                   this.ssoService.getPersonByGroupId(3022,1003).subscribe(data => {
                    emails = data.result.map(a=>a.email)
                    this.notifyClientByEmail({
                        ToEmail: emails,
                        Subject: subject,
                        Body: body,
                        Attachments: []
                    })});
                    }
                    if(EstadosValidacion == 'Devuelta por VIOTDR'){
                        subject = hayComentarios && EstadosValidacion ? 'nuevos comentarios registrados y estado cambiados' :
                        hayComentarios ? 'Nuevo comentario registrado' :
                        estadocambio ? 'Estado cambiado' : 'Se ha hecho una modificación en la demanda';
                     body = hayComentarios && estadocambio ?
                    `La institucion VIOTDR ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                     hayComentarios ?
                    `La institucion VIOTDR ha realizado nuevos comentarios a la demanda ${demandaDescripcion}` :
                    estadocambio ?
                    `La institucion VIOTDR ha cambiado el estado de validacion en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}", favor revisar la demanda y enviela de nuevo` :
                   `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                   this.ssoService.getPersonByGroupId(1009,1003).subscribe(data => {
                    emails = data.result.map(a=>a.email)
                    this.notifyClientByEmail({
                        ToEmail: emails,
                        Subject: subject,
                        Body: body,
                        Attachments: []
                    })
                 });  
                
                }
                    
                    break;

                case GrupoUsuario.DGDES:
                if(EstadosValidacion == 'Validada por DGDES'){
                subject = hayComentarios && EstadosValidacion ? 'nuevos comentarios registrados y estado cambiados' :
                hayComentarios ? 'Nuevo comentario registrado' :
                estadocambio ? 'Estado cambiado' :
                seleasignounademanda?    'Nueva demanda asignada' : 'Se ha hecho una modificación en la demanda'
                body = hayComentarios && estadocambio ?
                `La institucion DGES ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                hayComentarios ?    `La institucion DGES ha realizado nuevos comentarios a la demanda ${demandaDescripcion}` :
                estadocambio ?
                 `La institucion DGES ha cambiado el estado de validacion en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                 seleasignounademanda? `La institucion DGES le ha asignado la demanda "${demandaDescripcion}"`:
                 `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                 
                 
                 this.ssoInstitucion.getSSOInstitucionIds(listadoInstituciones)
                 .pipe(
                    switchMap(data => {
                        datostransformados = data
                        return this.ssoService.GetPersonByInstitutionId(datostransformados,1003)
                    })
                 )
                 .subscribe(data => {
                    emails = data.result.map(a=>a.email)
                    this.notifyClientByEmail({
                        ToEmail: emails,
                        Subject: subject,
                        Body: body,
                        Attachments: []
                    })
                 });
                break;

                }
                if (EstadosValidacion == 'Devuelta por DGDES') {
                    subject = hayComentarios && EstadosValidacion ? 'nuevos comentarios registrados y estado cambiados' :
                      hayComentarios ? 'Nuevo comentario registrado' :
                      estadocambio ? 'Estado cambiado' :
                      seleasignounademanda ? 'Nueva demanda asignada' : 'Se ha hecho una modificación en la demanda';
                  
                    body = hayComentarios && estadocambio ?
                      `La institución DGES ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion || 'Estado no definido'}"` :
                      hayComentarios ?
                        `La institución DGES ha realizado nuevos comentarios a la demanda ${demandaDescripcion}` :
                        estadocambio ?
                          `La institución DGES ha cambiado el estado de validación en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion || 'Estado no definido'}" favor revisar la demanda y enviarla de nuevo` :
                          `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                  
                    this.ssoService.getPersonByGroupId(3021, 1003).subscribe(data => {
                      emails = data.result.map(a => a.email);
                      this.notifyClientByEmail({
                        ToEmail: emails,
                        Subject: subject,
                        Body: body,
                        Attachments: []
                      });
                    });

                break;
                }
                case GrupoUsuario.institucionalRUDT:
                    subject = hayComentarios && estadocambio && sesubioevidencia ? 'nuevos comentarios registrados, estado cambiados y evidencia subida en las demanda' :
                              hayComentarios ? 'Nuevo comentario registrado en las demanda' :
                              estadocambio ? 'Estado de demanda cambiado' :
                              sesubioevidencia ? 'Nueva evidencia subida'
                              : 'Se ha hecho una modificación en la demanda';
                    body = hayComentarios && estadocambio && sesubioevidencia ?
                        `La institucion ${institucion} ha realizado nuevos comentarios,ha subido evidencia y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}"` :
                        hayComentarios ?
                        `Se han añadido nuevos comentarios a la demanda ${demandaDescripcion}` :
                        estadocambio ?
                        `La institucion ${institucion} ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}" ` :
                        sesubioevidencia?
                        `La institucion ${institucion} ha cambiado su estado de la demanda "${demandaDescripcion}", ademas a adjuntado una evidencia, ha pasado a "${estadonuevo}" `:
                        `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                        this.ssoService.getPersonByGroupId(3022,1003).subscribe(data => {
                            emails = data.result.map(a=>a.email)
                            this.notifyClientByEmail({
                                ToEmail: emails,
                                Subject: subject,
                                Body: body,
                                Attachments: []
                            })
                         });
                    break;

            default:
                // Manejo para acciones desconocidas o no especificadas
            console.log('No esta pasando')
                break;    
        }

        return ;
    }


    public notifyClientByEmail(datos: Iemail): void {
        console.log("Junior prueba",datos);
        
         this.emailService.createEmail(datos).subscribe(
             (response) => {
                 console.log('Correo enviado con éxito:', response);
             },
             (error) => {
                 console.error('Error al enviar el correo:', error);
             }
         );
    }
}


export default emailUtils;


