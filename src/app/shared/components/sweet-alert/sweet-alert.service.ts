import { Injectable } from '@angular/core'
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  async AlertConfirm(
    Title: string,
    Text: string,
    TypeSuccessErrorOrWarning: SweetAlertIcon
  ): Promise<boolean> {
    const a = await Swal.fire({
      title: Title,
      text: Text,
      icon: TypeSuccessErrorOrWarning,
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    })
    return a.isConfirmed
  }

  private alert(
    title: string,
    text: string,
    TypeSuccessErrorOrWarning: SweetAlertIcon,
    buttonContext?: object
  ): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title,
      text,
      icon: TypeSuccessErrorOrWarning,
      ...buttonContext
    })
  }

  async success(text, title = 'Éxito') {
    const swal = await this.alert(title, text, 'success', { confirmButtonText: 'Ok' })
    return swal.dismiss
  }

  async warning(text, title = 'Advertencia') {
    const swal = await this.alert(title, text, 'warning', { cancelButtonText: 'Cancel', confirmButtonText: 'Ok' })
    return swal.dismiss
  }

  async error(text, title = 'Error') {
    const swal = await this.alert(title, text, 'error', { cancelButtonText: 'Cancel', confirmButtonText: 'Ok' })
    return swal.dismiss
  }

  async info(text: string, title = 'Información') {
  const swal = await this.alert(title, text, 'info', {
    confirmButtonText: 'Entendido',
  });
  return swal.dismiss;
}

}
