import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (order) => {
  const filePath = path.join(
    process.cwd(),
    "invoices",
    `invoice_${order._id}.pdf`,
  );

  const invoicesDir = path.join(process.cwd(), "invoices");

  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir);
  }

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Kashmiri Gifts Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Total: ₹${order.totalAmount}`);
  doc.text(`Payment: ${order.paymentMethod}`);
  doc.text(`Status: ${order.orderStatus}`);
  doc.text(`Delivery ETA: ${order.deliveryETA.toDateString()}`);

  doc.moveDown();
  doc.text("Items:");

  order.items.forEach((item) => {
    doc.text(
      `${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`,
    );
  });

  doc.end();

  return filePath;
};
