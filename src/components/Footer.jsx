import React from "react";

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <p>&copy; {new Date().getFullYear()} MyWebsite. All rights reserved.</p>
                <div style={styles.links}>
                    <a href="/about" style={styles.link}>About</a>
                    <a href="/contact" style={styles.link}>Contact</a>
                    <a href="/privacy" style={styles.link}>Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: "#222",
        color: "#fff",
        padding: "20px 0",
        textAlign: "center",
    },
    container: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    links: {
        marginTop: "10px",
    },
    link: {
        color: "#fff",
        margin: "0 10px",
        textDecoration: "none",
    },
};

export default Footer;