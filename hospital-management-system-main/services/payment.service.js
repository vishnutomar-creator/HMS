const paymentRepository = require("../repositories/payment.repository");
const billingRepository = require("../repositories/billing.repository");
const eventEmitter = require("../events/eventEmitter");

const createPayment = async (paymentData) => {
  const payment = await paymentRepository.createPayment(paymentData);
  
  if (payment.status === "success" && paymentData.billingId) {
    const billing = await billingRepository.getBillingById(paymentData.billingId);
    if (billing) {
      const allPayments = await paymentRepository.getPayments();
      const billingPayments = allPayments.filter(p => p.billingId && (p.billingId._id ? p.billingId._id.toString() : p.billingId.toString()) === billing._id.toString() && p.status === "success");
      const totalPaid = billingPayments.reduce((acc, curr) => acc + curr.amount, 0);
      
      let status = "pending";
      if (totalPaid > 0 && totalPaid < billing.totalAmount) {
        status = "partially_paid";
      } else if (totalPaid >= billing.totalAmount) {
        status = "paid";
      }
      
      await billingRepository.updateBilling(billing._id, { status });
    }
    eventEmitter.emit("paymentSuccess", payment);
  }

  return payment;
};

const getPayments = async () => {
  return await paymentRepository.getPayments();
};

const getPaymentById = async (id) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  return payment;
};

const updatePayment = async (id, paymentData) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  return await paymentRepository.updatePayment(id, paymentData);
};

const deletePayment = async (id) => {
  const payment = await paymentRepository.getPaymentById(id);
  if (!payment) {
    const error = new Error("Payment not found");
    error.statusCode = 404;
    throw error;
  }
  await paymentRepository.deletePayment(id);
  return { message: "Payment deleted successfully" };
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
