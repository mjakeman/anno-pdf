import Container from "../../Container";

export default function Terms() {
    return (
        <Container>
            <section className="my-12">
                <p className="text-neutral-400 dark:text-white">Terms</p>
                <h1 className="mt-2 text-4xl font-bold text-anno-red-primary dark:text-anno-pink-500">Terms of Use and Privacy Policy</h1>
                <div className="text-lg dark:text-white mt-12 text-justify">
                    <p>
                        <b>
                            Note: This is a sample document and NOT an official Terms of Use and Privacy Policy. It is
                            provided for educational purposes and should not be considered legally binding. For official
                            and legally enforceable policies, please consult with legal professionals or advisors.
                        </b>
                    </p>
                    <br />
                    <h1 className="mt-2 text-2xl font-bold text-black dark:text-white">Terms of Use</h1>
                    <br />
                    <p>
                        Welcome to Anno! Please read these Terms of Use carefully before using our website.
                        By accessing or using the website, you agree to be bound by these terms and conditions.
                        If you do not agree with any part of these terms, please do not use the website.
                    </p>
                    <br />
                    <ol className="list-decimal ml-8">
                        <li>
                            <p><b>Intellectual Property:</b></p>
                            <p>All content on the website, including but not limited to text, graphics, logos, images,
                                and software, is the property of Anno or its licensors and is protected by intellectual
                                property laws. You may not modify, distribute, reproduce, or create derivative works
                                based on our content without explicit permission.</p>
                        </li>
                        <li>
                            <p><b>Limited Liability:</b></p>
                            <p>As Anno is currently in the development phase and not fully functional, we do not guarantee
                                the accuracy, availability, or reliability of the website. We shall not be held liable
                                for any direct, indirect, incidental, or consequential damages resulting from your use
                                or inability to use the website.</p>
                        </li>
                    </ol>
                    <br />
                    <br />
                    <h1 className="mt-2 text-2xl font-bold text-black dark:text-white">Privacy Policy</h1>
                    <br />
                    <p>
                        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect
                        your personal information on this website.
                    </p>
                    <br />
                    <ol className="list-decimal ml-8">
                        <li>
                            <p><b>Information Collection:</b></p>
                            <p>We may collect personal information, such as your name and email address, if you choose to
                                provide it voluntarily through various forms. We assure you that any information you provide
                                will be securely stored and used only for the purpose of conveying the web-app idea related
                                to the university course assignment.
                            </p>
                        </li>
                        <li>
                            <p><b>Data Security:</b></p>
                            <p>We take the security of your information seriously and implement appropriate measures to
                                protect it from unauthorized access, alteration, or disclosure. However, please understand
                                that no method of transmission or storage over the internet is 100% secure, and we cannot
                                guarantee absolute security.
                            </p>
                        </li>
                        <li>
                            <p><b>Third-party Websites:</b></p>
                            <p>
                                This website may contain links to third-party websites. We are not responsible for the
                                privacy practices or content of such websites. We encourage you to review the privacy
                                policies of those websites before providing any personal information.
                            </p>
                        </li>
                    </ol>
                    <br />
                    <p>
                        If you have any questions or concerns about our Terms of Use or Privacy Policy, please contact us at the provided email address.
                    </p>
                    <p>
                        Again, please remember that this is not an official document and should not be considered legally binding. Seek appropriate legal advice when creating official policies.
                    </p>
                </div>
            </section>
        </Container>
    );
}