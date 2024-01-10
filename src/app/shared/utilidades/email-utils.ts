// email-utils.ts

import { Iemail } from "app/shared/models/Iemail";
import { EmailService } from "app/shared/services/email.service";

export class emailUtils{
    constructor( private EmailService : EmailService){}

     public constructEmail(
        demandaDescripcion: string,
        accionesresult: string, 
        hayComentarios?: boolean,
        estadocambio?:boolean,
        estadonuevo?:any ): Iemail | null {

        let action: string;
        let subject:string
        let body: string;
        enum options{
            MODIFICADO = 'modificado',
        }

        switch (accionesresult) {
        
            case options.MODIFICADO:
                if (hayComentarios) {
                    subject = 'Nuevo comentario registrado'
                    body = `Se han añadido nuevos comentarios a la demanda ${demandaDescripcion}`;
                } else if (estadocambio) {
                    subject = 'Estado cambiado'
                    body = `Se ha cambiado el estado de validación a la demanda "${demandaDescripcion}", ha pasado a "${estadonuevo}"`;
                } else {
                    body = `Se ha hecho una modificación en la demanda: ${demandaDescripcion}`;
                }
                break;
            default:
                // Manejo para acciones desconocidas o no especificadas
                break;
        }
        
        return {
            ToEmail: 'rensomiguel3@gmail.com',
            Subject: subject,
            Body: body,
            Attachments: []
        };
    }
    
    public notifyClientByEmail(datos: Iemail): void {
        this.EmailService.createEmail(datos)
            .subscribe(
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
