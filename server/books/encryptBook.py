import os
import base64
from pikepdf import Pdf, Encryption


def encryptFile(filename, password):
    try:
        filename_not_encrypted = filename[:-4]+'.pdf'
        filename_encrypted = filename.strip('.pdf')+'_encrypted.pdf'
        pdf = Pdf.open(filename_not_encrypted)
        pdf.save(filename_encrypted, encryption=Encryption(
            owner="base_password_to_open_books", user=password, R=4))
        pdf.close()
        return True
    except Exception as e:
        print("Already encrypted file")
        return False


def encryptFileForDetail(filename, password):
    try:
        filename_not_encrypted = filename[:-4]+'.pdf'
        filename_encrypted = filename.strip('.pdf')+'_encrypted.pdf'
        pdf = Pdf.open(filename_not_encrypted)
        pdf.save(filename_encrypted, encryption=Encryption(
            owner="base_password_to_open_books", user=password, R=4))
        pdf.close()
        os.remove(filename)
        return filename_encrypted
    except Exception as e:
        print("Already encrypted file")


def encryptPasswordField(not_encrypted_data):
    params_bytes = not_encrypted_data.encode('ascii')
    base64_bytes = base64.b64encode(params_bytes)
    base64_params = base64_bytes.decode('ascii')
    encrypted_result = base64_params
    return encrypted_result


def decryptPasswordField(encrypted_data):
    base64_bytes = encrypted_data.encode('ascii')
    params_bytes = base64.b64decode(base64_bytes)
    decrypted_result = params_bytes.decode('ascii')
    return decrypted_result
