import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

class PDFService {
    /**
     * Genera un PDF de ticket de turno con código QR
     * @param {Object} turno - Datos del turno
     * @param {Object} alumno - Datos del alumno
     * @param {Object} detalles - Detalles adicionales (municipio, nivel, asunto)
     * @returns {Promise<Buffer>} Buffer del PDF generado
     */
    async generarTicketPDF(turno, alumno, detalles) {
        return new Promise(async (resolve, reject) => {
            try {
                // Crear documento PDF
                const doc = new PDFDocument({
                    size: 'LETTER',
                    margins: { top: 50, bottom: 50, left: 50, right: 50 }
                });

                // Buffer para almacenar el PDF
                const chunks = [];
                doc.on('data', chunk => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                // Generar código QR con la CURP
                const qrDataURL = await QRCode.toDataURL(alumno.curp, {
                    width: 150,
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                });

                // Convertir Data URL a Buffer
                const qrBuffer = Buffer.from(qrDataURL.split(',')[1], 'base64');

                // ===== ENCABEZADO =====
                doc.fontSize(20)
                   .font('Helvetica-Bold')
                   .text('TICKET DE TURNO', { align: 'center' })
                   .moveDown(0.5);

                doc.fontSize(12)
                   .font('Helvetica')
                   .text('Sistema de Gestión de Turnos', { align: 'center' })
                   .moveDown(1);

                // Línea separadora
                doc.moveTo(50, doc.y)
                   .lineTo(562, doc.y)
                   .stroke()
                   .moveDown(1);

                // ===== INFORMACIÓN DEL TURNO =====
                const inicioSeccion = doc.y;

                doc.fontSize(16)
                   .font('Helvetica-Bold')
                   .text('NÚMERO DE TURNO:', 50, doc.y);

                doc.fontSize(24)
                   .fillColor('#0066CC')
                   .text(turno.numero_turno, 50, doc.y)
                   .fillColor('#000000')
                   .moveDown(1);

                doc.fontSize(10)
                   .font('Helvetica')
                   .text(`Fecha de emisión: ${this.formatearFecha(turno.fecha_creacion)}`, 50, doc.y)
                   .text(`Estado: ${this.formatearEstado(turno.estado)}`)
                   .moveDown(1);

                // Código QR (al lado derecho)
                doc.image(qrBuffer, 420, inicioSeccion, { width: 120 });
                doc.fontSize(8)
                   .text('Escanear para CURP', 430, inicioSeccion + 125, { width: 100, align: 'center' });

                // ===== DATOS DEL SOLICITANTE =====
                doc.moveDown(2);
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .text('DATOS DEL SOLICITANTE', 50, doc.y)
                   .moveDown(0.5);

                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('Nombre completo:', 50, doc.y)
                   .font('Helvetica')
                   .text(alumno.nombre_completo, 180, doc.y);

                doc.moveDown(0.3)
                   .font('Helvetica-Bold')
                   .text('CURP:', 50, doc.y)
                   .font('Helvetica')
                   .text(alumno.curp, 180, doc.y);

                if (alumno.telefono) {
                    doc.moveDown(0.3)
                       .font('Helvetica-Bold')
                       .text('Teléfono:', 50, doc.y)
                       .font('Helvetica')
                       .text(alumno.telefono, 180, doc.y);
                }

                if (alumno.celular) {
                    doc.moveDown(0.3)
                       .font('Helvetica-Bold')
                       .text('Celular:', 50, doc.y)
                       .font('Helvetica')
                       .text(alumno.celular, 180, doc.y);
                }

                if (alumno.correo) {
                    doc.moveDown(0.3)
                       .font('Helvetica-Bold')
                       .text('Correo:', 50, doc.y)
                       .font('Helvetica')
                       .text(alumno.correo, 180, doc.y);
                }

                // ===== DATOS DEL TRÁMITE =====
                doc.moveDown(1.5);
                doc.fontSize(14)
                   .font('Helvetica-Bold')
                   .text('DATOS DEL TRÁMITE', 50, doc.y)
                   .moveDown(0.5);

                doc.fontSize(10)
                   .font('Helvetica-Bold')
                   .text('Nivel educativo:', 50, doc.y)
                   .font('Helvetica')
                   .text(detalles.nivel || 'N/A', 180, doc.y);

                doc.moveDown(0.3)
                   .font('Helvetica-Bold')
                   .text('Municipio:', 50, doc.y)
                   .font('Helvetica')
                   .text(detalles.municipio || 'N/A', 180, doc.y);

                doc.moveDown(0.3)
                   .font('Helvetica-Bold')
                   .text('Asunto:', 50, doc.y)
                   .font('Helvetica')
                   .text(detalles.asunto || 'N/A', 180, doc.y);

                // ===== INSTRUCCIONES =====
                doc.moveDown(2);
                doc.moveTo(50, doc.y)
                   .lineTo(562, doc.y)
                   .stroke()
                   .moveDown(0.5);

                doc.fontSize(12)
                   .font('Helvetica-Bold')
                   .text('INSTRUCCIONES IMPORTANTES:', 50, doc.y)
                   .moveDown(0.5);

                doc.fontSize(9)
                   .font('Helvetica')
                   .list([
                       'Guarde este comprobante, lo necesitará para su trámite.',
                       'Presente su CURP original y este ticket al momento de ser atendido.',
                       'Puede consultar el estado de su turno con su CURP y número de turno.',
                       'Para modificar su solicitud, utilice su CURP y número de turno en el sistema.',
                       'El turno es personal e intransferible.'
                   ], 50, doc.y, { bulletRadius: 2 });

                // ===== PIE DE PÁGINA =====
                doc.fontSize(8)
                   .font('Helvetica')
                   .text(
                       'Este documento es un comprobante electrónico generado automáticamente.',
                       50,
                       700,
                       { align: 'center', width: 512 }
                   );

                doc.fontSize(7)
                   .fillColor('#666666')
                   .text(
                       `Generado el ${this.formatearFechaCompleta(new Date())}`,
                       50,
                       715,
                       { align: 'center', width: 512 }
                   );

                // Finalizar el documento
                doc.end();

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Formatea una fecha en formato corto
     */
    formatearFecha(fecha) {
        const date = new Date(fecha);
        const opciones = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        return date.toLocaleDateString('es-MX', opciones);
    }

    /**
     * Formatea una fecha completa
     */
    formatearFechaCompleta(fecha) {
        const opciones = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return fecha.toLocaleDateString('es-MX', opciones);
    }

    /**
     * Formatea el estado del turno
     */
    formatearEstado(estado) {
        const estados = {
            'pendiente': 'PENDIENTE',
            'en_atencion': 'EN ATENCIÓN',
            'atendido': 'ATENDIDO',
            'cancelado': 'CANCELADO'
        };
        return estados[estado] || estado.toUpperCase();
    }
}

// Exportar instancia singleton
export default new PDFService();