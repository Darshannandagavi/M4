import React, { useState } from 'react';
import { WEAPONS, LOOT_ITEMS } from '../../config/gameConstants';

const ICON_MAP = {
  weapon: '🔫',
  ammo: '📦',
  medkit: '🩹',
  armor: '🛡️',
  helmet: '🪖',
};

function getItemIcon(type) {
  return ICON_MAP[type] || '📦';
}

function getItemDef(itemId) {
  return LOOT_ITEMS[itemId] || WEAPONS[itemId] || null;
}

export default function InventoryUI({
  isOpen = false,
  inventory = {},
  ammoState = {},
  weaponId = 'fist',
  onClose,
  onEquipWeapon,
  onDropItem,
  onUseMedkit,
}) {
  const [selectedUid, setSelectedUid] = useState(null);

  if (!isOpen) return null;

  const items = inventory.items || [];
  const primaryWeapon = inventory.primaryWeapon;
  const secondaryWeapon = inventory.secondaryWeapon;
  const vest = inventory.vest;
  const helmet = inventory.helmet;
  const medkits = inventory.medkits || 0;

  const selectedItem = items.find((it) => it.uid === selectedUid) || null;
  const selectedDef = selectedItem ? getItemDef(selectedItem.itemId) : null;

  // --- Equipment helpers ---
  function renderSlot(label, itemId, slotType) {
    const def = itemId ? getItemDef(itemId) : null;
    const equipped = !!def;
    const isActive = weaponId && itemId && weaponId === itemId;
    const ammo = (slotType === 'weapon' && itemId && ammoState[itemId]) ? ammoState[itemId] : null;

    return (
      <div className={`ff-inv-slot${equipped ? ' equipped' : ''}${isActive ? ' active-weapon' : ''}`}>
        <span className="ff-inv-slot-icon">
          {def ? getItemIcon(def.type || slotType) : '—'}
        </span>
        <span className="ff-inv-slot-label">{label}</span>
        {def && <span className="ff-inv-slot-name">{def.label || def.name || itemId}</span>}
        {ammo && (
          <span className="ff-inv-slot-ammo">{ammo.mag} / {ammo.reserve}</span>
        )}
      </div>
    );
  }

  // --- Action buttons for selected item ---
  function renderActions() {
    if (!selectedItem || !selectedDef) return null;
    const type = selectedDef.type;
    return (
      <div className="ff-inv-actions">
        {(type === 'weapon') && (
          <>
            <button
              className="ff-inv-action-btn"
              onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'primary')}
            >
              EQUIP PRIMARY
            </button>
            <button
              className="ff-inv-action-btn"
              onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'secondary')}
            >
              EQUIP SECONDARY
            </button>
          </>
        )}
        {(type === 'armor') && (
          <button
            className="ff-inv-action-btn"
            onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'vest')}
          >
            EQUIP
          </button>
        )}
        {(type === 'helmet') && (
          <button
            className="ff-inv-action-btn"
            onClick={() => onEquipWeapon && onEquipWeapon(selectedItem.itemId, 'helmet')}
          >
            EQUIP
          </button>
        )}
        {(type === 'medkit') && (
          <button
            className="ff-inv-action-btn"
            onClick={() => onUseMedkit && onUseMedkit()}
          >
            USE
          </button>
        )}
        <button
          className="ff-inv-action-btn ff-inv-action-drop"
          onClick={() => {
            if (onDropItem) onDropItem(selectedItem.uid);
            setSelectedUid(null);
          }}
        >
          DROP
        </button>
      </div>
    );
  }

  return (
    <div className="ff-inv-overlay" onClick={onClose}>
      <div className="ff-inv-panel" onClick={(e) => e.stopPropagation()}>
        {/* Left Panel — Equipment */}
        <div className="ff-inv-equip-panel">
          <h3 className="ff-inv-section-title">EQUIPMENT</h3>
          {renderSlot('Helmet', helmet, 'helmet')}
          {renderSlot('Vest', vest, 'armor')}
          {renderSlot('Primary', primaryWeapon, 'weapon')}
          {renderSlot('Secondary', secondaryWeapon, 'weapon')}
          <div className="ff-inv-slot">
            <span className="ff-inv-slot-icon">🩹</span>
            <span className="ff-inv-slot-label">Medkits</span>
            <span className="ff-inv-slot-name">×{medkits}</span>
          </div>
        </div>

        {/* Center Panel — Backpack Grid */}
        <div className="ff-inv-backpack">
          <h3 className="ff-inv-section-title">BACKPACK</h3>
          <div className="ff-inv-backpack-grid">
            {items.length === 0 && (
              <div className="ff-inv-empty">No items collected</div>
            )}
            {items.map((item) => {
              const def = getItemDef(item.itemId);
              if (!def) return null;
              const isSelected = item.uid === selectedUid;
              return (
                <div
                  key={item.uid}
                  className={`ff-inv-item-card${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedUid(isSelected ? null : item.uid)}
                >
                  <span className="ff-inv-item-icon">{getItemIcon(def.type)}</span>
                  <span className="ff-inv-item-name">{def.label || def.name || item.itemId}</span>
                  {item.quantity > 1 && (
                    <span className="ff-inv-item-qty">×{item.quantity}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel — Item Details */}
        <div className="ff-inv-details-panel">
          <h3 className="ff-inv-section-title">DETAILS</h3>
          {selectedDef ? (
            <>
              <div className="ff-inv-detail-icon">{getItemIcon(selectedDef.type)}</div>
              <div className="ff-inv-detail-name">{selectedDef.label || selectedDef.name}</div>
              {selectedDef.rarity && (
                <div className="ff-inv-detail-rarity">{selectedDef.rarity}</div>
              )}
              {selectedDef.damage && (
                <div className="ff-inv-detail-stat">DMG: {selectedDef.damage}</div>
              )}
              {selectedDef.fireRate && (
                <div className="ff-inv-detail-stat">RATE: {selectedDef.fireRate}</div>
              )}
              {selectedDef.description && (
                <div className="ff-inv-detail-desc">{selectedDef.description}</div>
              )}
              {renderActions()}
            </>
          ) : (
            <div className="ff-inv-empty">Select an item</div>
          )}
        </div>
      </div>

      {/* Bottom hint */}
      <div className="ff-inv-close-hint">Press TAB to close</div>
    </div>
  );
}
