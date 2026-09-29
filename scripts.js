const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
	menuButton.addEventListener("click", () => {
		const isOpen = navLinks.classList.toggle("open");

		menuButton.setAttribute("aria-expanded", String(isOpen));
		menuButton.setAttribute(
			"aria-label",
			isOpen ? "Fechar menu" : "Abrir menu"
		);
	});

	navLinks.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			navLinks.classList.remove("open");
			menuButton.setAttribute("aria-expanded", "false");
			menuButton.setAttribute("aria-label", "Abrir menu");
		});
	});
}

const paymentTabs = Array.from(document.querySelectorAll("[role='tab'][aria-controls^='payment-panel-']"));
const paymentForm = document.querySelector("#payment-booking-form");

function activatePaymentTab(selectedTab) {
	paymentTabs.forEach((tab) => {
		const isSelected = tab === selectedTab;

		tab.setAttribute("aria-selected", String(isSelected));
		tab.tabIndex = isSelected ? 0 : -1;

		const panel = document.getElementById(tab.getAttribute("aria-controls"));
		if (panel) {
			panel.hidden = !isSelected;
		}
	});
}

paymentTabs.forEach((tab, index) => {
	tab.addEventListener("click", () => activatePaymentTab(tab));
	tab.addEventListener("keydown", (event) => {
		if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
			return;
		}

		event.preventDefault();
		let nextIndex = index;

		if (event.key === "ArrowLeft") nextIndex = (index - 1 + paymentTabs.length) % paymentTabs.length;
		if (event.key === "ArrowRight") nextIndex = (index + 1) % paymentTabs.length;
		if (event.key === "Home") nextIndex = 0;
		if (event.key === "End") nextIndex = paymentTabs.length - 1;

		paymentTabs[nextIndex].focus();
		activatePaymentTab(paymentTabs[nextIndex]);
	});
});

if (paymentForm) {
	paymentForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const name = paymentForm.elements.name.value.trim();
		const service = paymentForm.elements.service.value;
		const selectedTab = paymentTabs.find((tab) => tab.getAttribute("aria-selected") === "true");
		const paymentMethod = selectedTab?.textContent.trim() ?? "A combinar";
		const message = [
			"Olá! Quero agendar na Paulinho Barber.",
			`Nome: ${name}`,
			`Serviço: ${service}`,
			`Forma de pagamento: ${paymentMethod}`
		].join("\n");

		window.location.assign(`https://wa.me/5587988257489?text=${encodeURIComponent(message)}`);
	});
}
