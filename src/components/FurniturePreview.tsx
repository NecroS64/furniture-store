import { Furniture } from "../types/furniture";

const renderPreview = (model:Furniture) => {
    const widthPx = model.width * 2;
    const heightPx = model.height * 2;
    const depthPx = model.depth * 2;

    switch (model.type) {
      case "шкаф":
        return (
          <div
            style={{
              position: "relative",
              width: widthPx,
              height: heightPx,
              backgroundColor: model.color,
              border: "2px solid #333",
              margin: "auto",
            }}
          >
            {/* Полки */}
            {model.shelves?.map((shelf) => (
              <div
                key={shelf.id}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: shelf.color.toString(),
                  top: `${100 - shelf.heightPercent}%`,
                  transform: "translateY(-2px)",
                }}
              />
            ))}
          </div>
        );
      case "диван":
        return (
          <div
            style={{
              width: widthPx,
              height: heightPx,
              backgroundColor: model.color,
              borderRadius: 15,
              position: "relative",
              margin: "auto",
              border: "2px solid #333",
            }}
          >
            {/* Подлокотники */}
            {model.hasArmrests && (
              <>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: 20,
                    height: "100%",
                    backgroundColor: "#555",
                    borderRadius: "15px 0 0 15px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: 20,
                    height: "100%",
                    backgroundColor: "#555",
                    borderRadius: "0 15px 15px 0",
                  }}
                />
              </>
            )}
            {/* Сиденья */}
            <div
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "space-between",
                padding: "0 25px",
                boxSizing: "border-box",
              }}
            >
              {model.seats?.map((seat, i) => (
                <div
                  key={seat.id}
                  style={{
                    backgroundColor: seat.color || "#000000", // ← здесь
                    flex: 1,
                    margin: "0 5px",
                    borderRadius: 8,
                    height: "100%", // можно задать фиксированную высоту
                  }}
                />
              ))}
            </div>
          </div>
        );
      case "стол":
        return (
          <div
            style={{
              width: widthPx,
              height: heightPx,
              backgroundColor: model.color,
              position: "relative",
              margin: "auto",
              border: "2px solid #333",
              borderRadius: 6,
            }}
          >
            {/* Ножки стола */}
            {["leftTop", "rightTop", "leftBottom", "rightBottom"].map((pos) => {
              const styleMap: Record<string, React.CSSProperties> = {
                leftTop: { top: 5, left: 5 },
                rightTop: { top: 5, right: 5 },
                leftBottom: { bottom: 5, left: 5 },
                rightBottom: { bottom: 5, right: 5 },
              };
              return (
                <div
                  key={pos}
                  style={{
                    position: "absolute",
                    width: 10,
                    height: 30,
                    backgroundColor: model.legsMaterial === "металл" ? "#555" : "#8B4513",
                    borderRadius: 2,
                    ...styleMap[pos],
                  }}
                />
              );
            })}
          </div>
        );
    }
    
  };

export default renderPreview