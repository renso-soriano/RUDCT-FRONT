// email-utils.ts

import { Iemail } from "app/shared/models/Iemail";
import { EmailService } from "app/shared/services/email.service";
import {GrupoUsuario} from "app/shared/models/grupoUsuario.enum";
export class emailUtils {
    constructor(private emailService: EmailService) {}

    public constructEmail(
        demandaDescripcion: string,
        accionesresult?: string,
        gruposUsuario?: number,
        institucion?: string,
        hayComentarios?: boolean,
        estadocambio?: boolean,
        estadonuevo?: any
    ): Iemail | null {
        let subject: string;
        let body: string;
        let email: string;

        switch (gruposUsuario) {
            case GrupoUsuario.institucionalRUDT:
                subject = hayComentarios && estadocambio ? 'nuevos comentarios registrados y estado cambiados' :
                          hayComentarios ? 'Nuevo comentario registrado' :
                          estadocambio ? 'Estado cambiado' : 'Se ha hecho una modificación en la demanda';
                body = hayComentarios && estadocambio ?
                    `La institucion ${institucion} ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}" BOBO GALACTICO` :
                    hayComentarios ?
                    `Se han añadido nuevos comentarios a la demanda ${demandaDescripcion} BOBO GALACTICO` :
                    estadocambio ?
                    `La institucion ${institucion} ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}" BOBO GALACTICO` :
                    `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                email = 'rensomiguel3@gmail.com';
                break;

            case GrupoUsuario.DGDES:
                subject = hayComentarios && estadocambio ? 'nuevos comentarios registrados y estado cambiados' :
                          hayComentarios ? 'Nuevo comentario registrado' :
                          estadocambio ? 'Estado cambiado' : 'Se ha hecho una modificación en la demanda';
                body = hayComentarios && estadocambio ?
                    `La institucion ${institucion} ha realizado nuevos comentarios y ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}"` :
                    hayComentarios ?
                    `Se han añadido nuevos comentarios a la demanda ${demandaDescripcion}` :
                    estadocambio ?
                    `La institucion ${institucion} ha cambiado su estado de la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}"` :
                    `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                email = 'rensomiguel1@gmail.com';
                break;

            default:
                // Manejo para acciones desconocidas o no especificadas
                break;
        }

        return {
            ToEmail: email,
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
