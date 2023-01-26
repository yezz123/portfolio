import React from "react"
import Image from "../image"
import Links from "../links"

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container h-100">
        <div className="row h-100 justify-content-around">
          {/* + Hero section: Left side */}
          <div className="col-lg-5 my-auto">
            <div className="hero-introduction">
              <h1>Hi. I'm Yezz123</h1>
              <p>
                Software Engineer &amp; Business Owner 👨‍💻.
              </p>
              <a href="https://blog.yezz.me/blog/Tech-and-Tools-I-Use" target="_blank" rel="noreferrer">
                <button className="main-button btn btn-primary shadow-sm">
                  /Uses
                </button>
              </a>
            </div>
          </div>
          {/* - Hero section: Left side */}

          {/* + Hero section: Right side */}
          <div className="col-lg-4 my-auto">
            <div className="hero-bio">
              <div className="card shadow-sm mb-5">
                <div className="card-body">
                  <div className="icon">
                    <Image
                      fileName="wave.png"
                      style={{ width: "5rem", height: "5rem" }}
                      alt="Hero Icon"
                    />
                  </div>
                  <h3 className="card-title">@Thyasser1</h3>
                  <h4>
                    <span
                      className="mr-1"
                      role="img"
                      aria-label="pin"
                      alt="pin emoji"
                    >
                      📍
                    </span>
                    Morocco
                    <br />
                  </h4>
                  <p className="card-text">
                    Software Engineer,
                    <br />
                    Owner of{" "}
                    <a
                      href="https://yezz.me"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @Yezz LLC.
                    </a>
                    .
                    <br />I love{" "}
                    <a
                      href="https://github.com/yezz123"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      OpenSource
                    </a>{" "}
                    and building side projects.
                  </p>
                  <Links />
                </div>
              </div>
            </div>
          </div>
          {/* - Hero section: Right side */}
        </div>
      </div>
    </section>
  )
}
