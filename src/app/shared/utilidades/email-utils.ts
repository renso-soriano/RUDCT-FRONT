// email-utils.ts

import { Iemail } from "app/shared/models/Iemail";
import { EmailService } from "app/shared/services/email.service";
import {GrupoUsuario} from "app/shared/models/grupoUsuario.enum";
import { SSOService } from "../services/sso.service";




export class emailUtils {
    constructor(
        private emailService: EmailService,
        private ssoService: SSOService
        ) {
            this.obtenerEmails()
        }
    obtenerEmails() {
        this.ssoService.getPersonByGroupId(3012,1003).subscribe(
            data => {
            console.log(data.result.map(a=>a.email)) 
            },
            error =>{
              console.error(error)
            })
    }

    public constructEmail(
        demandaDescripcion?: string,
        accionesresult?: string,
        gruposUsuario?: number,
        hayComentarios?: boolean,
        estadocambio?: boolean,
        institucion?: string,
        estadonuevo?: string,
        EstadosValidacion?:string,
    ): Iemail | null {

        let subject: string;
        let body: string;
        let emails: string[];
        let institucio = true
        
        
        
        switch (gruposUsuario) {
            case GrupoUsuario.regionalesRUDT:
                    if(EstadosValidacion == 'Registrada por ORP'){
                        subject = 'Nueva demanda registrada'
                        body = 'Se ha registrado una nueva demanda'
                        this.ssoService.getPersonByGroupId(3022,1003).subscribe(
                            data => {
                                emails =  data.result.map(a=>a.email)
                            },
                            error =>{
                              console.error(error)
                            }
                        )
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
                   emails = ['rensomiguel1@gmail.com'];
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
                    `La institucion VIOTDR ha cambiado el estado de validacion en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                   `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                   
                
                }
                    
                    break;

                case GrupoUsuario.DGDES:
                if(EstadosValidacion == 'Validada por DGDES'){
                subject = hayComentarios && EstadosValidacion ? 'nuevos comentarios registrados y estado cambiados' :
                hayComentarios ? 'Nuevo comentario registrado' :
                estadocambio ? 'Estado cambiado' :
                institucio?    'Nueva demanda asignada' : 'Se ha hecho una modificación en la demanda'
                body = hayComentarios && estadocambio ?
                `La institucion DGES ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                hayComentarios ?    `La institucion DGES ha realizado nuevos comentarios a la demanda ${demandaDescripcion}` :
                estadocambio ?
                 `La institucion DGES ha cambiado el estado de validacion en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                 `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                 
                    
                break;
                }
                if(EstadosValidacion == 'Devuelta por DGDES'){
                    subject = hayComentarios && EstadosValidacion ? 'nuevos comentarios registrados y estado cambiados' :
                hayComentarios ? 'Nuevo comentario registrado' :
                estadocambio ? 'Estado cambiado' :
                institucio?    'Nueva demanda asignada' : 'Se ha hecho una modificación en la demanda'
                body = hayComentarios && estadocambio ?
                `La institucion DGES ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                hayComentarios ?  `La institucion DGES ha realizado nuevos comentarios a la demanda ${demandaDescripcion}` :
                estadocambio ?
                 `La institucion DGES ha cambiado el estado de validacion en la demanda "${demandaDescripcion}", ha pasado a "${EstadosValidacion}"` :
                 `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                 this.ssoService.getPersonByGroupId(3022,1003).subscribe(
                    data => {
                        emails =  data.result.map(a=>a.email)
                    },
                    error =>{
                      console.error(error)
                    }
                )
                break;
                }
                case GrupoUsuario.institucionalRUDT:
                    subject = hayComentarios && estadocambio ? 'nuevos comentarios registrados y estado cambiados en las demanda' :
                              hayComentarios ? 'Nuevo comentario registrado en las demanda' :
                              estadocambio ? 'Estado de demanda cambiado' : 'Se ha hecho una modificación en la demanda';
                    body = hayComentarios && estadocambio ?
                        `La institucion ${institucion} ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}" BOBO GALACTICO` :
                        hayComentarios ?
                        `Se han añadido nuevos comentarios a la demanda ${demandaDescripcion}` :
                        estadocambio ?
                        `La institucion ${institucion} ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}" ` :
                        `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                        this.ssoService.getPersonByGroupId(3022,1003).subscribe(
                            data => {
                                emails =  data.result.map(a=>a.email)
                            },
                            error =>{
                              console.error(error)
                            }
                        )
                    break;

            default:
                // Manejo para acciones desconocidas o no especificadas
                break;
        }

        

        return {
            ToEmail: emails,
            Subject: subject,
            Body: body,
            Attachments: []
        };
    }


    public notifyClientByEmail(datos: Iemail): void {
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
