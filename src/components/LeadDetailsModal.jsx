import { formatTime } from "../managerUtils.js";

function phoneForUrl(phone) {
  return String(phone || "").replace(/[^\d+]/g, "");
}

export default function LeadDetailsModal({ lead, onClose }) {
  if (!lead) return null;

  const copyPhone = () => navigator.clipboard?.writeText(lead.phone || "");
  const copyEmail = () => navigator.clipboard?.writeText(lead.email || "");
  const whatsappNumber = phoneForUrl(lead.phone).replace(/^\+/, "");

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-label">Lead details</span>
            <h2 id="lead-modal-title">{lead.name}</h2>
          </div>
          <button className="button subtle" type="button" onClick={onClose}>Close Modal</button>
        </div>

        <div className="modal-info-grid">
          <span>Phone Number <strong>{lead.phone || "Not added"}</strong></span>
          <span>Email <strong>{lead.email || "Not added"}</strong></span>
          <span>Language <strong>{lead.language}</strong></span>
          <span>Property Type <strong>{lead.propertyType}</strong></span>
          <span>Budget <strong>{lead.budget}</strong></span>
          <span>Lead Source <strong>{lead.source}</strong></span>
          <span>Assigned Date <strong>{formatTime(lead.timestamp)}</strong></span>
          <span>Current Status <strong>{lead.leadStatus || lead.assignmentStatus}</strong></span>
        </div>

        <div className="modal-notes">
          <span className="section-label">Notes</span>
          <p>{lead.notes || "No notes added."}</p>
        </div>

        <div className="modal-actions">
          <a className="button primary" href={`tel:${phoneForUrl(lead.phone)}`}>Call Lead</a>
          <a className="button accent" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp Lead</a>
          <button className="button subtle" type="button" onClick={copyPhone}>Copy Phone Number</button>
          <button className="button subtle" type="button" onClick={copyEmail}>Copy Email</button>
          <button className="button subtle" type="button" onClick={onClose}>Close Modal</button>
        </div>
      </section>
    </div>
  );
}
